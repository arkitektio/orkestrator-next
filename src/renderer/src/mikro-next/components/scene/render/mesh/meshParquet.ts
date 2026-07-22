import {
  ensureHttpfs,
  getDuckDb,
  resolveDuckDbEndpoint,
} from "@/mikro-next/lib/duckdb/duckdb";
import type { MeshGeometryRow } from "./meshDecode";
import type { MeshCellRecord } from "./meshPlanner";

/**
 * DuckDB access to a mesh collection's Parquet stores. Concerns owned here:
 * grants, scoped secrets, SQL, and row → typed-value conversion — nothing
 * about three.js, planning or caching.
 *
 * Performance shape:
 *  - The DuckDB instance/worker is the app-lifetime singleton shared with the
 *    table UI (`lib/duckdb.getDuckDb`) — no second WASM instantiation.
 *  - The CELL INDEX is ONE aggregate query per collection version (projected
 *    columns only, so the geometry BLOBs are never scanned for it), cached on
 *    the instance — collections are immutable per `version`.
 *  - Geometry is fetched in ONE batched `cell IN (...)` query per plan; the
 *    shards are Morton-sorted, so row-group pruning turns that into range
 *    reads over httpfs.
 *  - Secrets are per-store NAMED and SCOPED (`SCOPE 's3://bucket/key'`), so
 *    concurrent mesh layers and the table UI's global `parquet_access` secret
 *    cannot clobber each other.
 */

export type ParquetStoreRef = { id: string; bucket: string; key: string };

export type ParquetGrant = {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
  bucket: string;
  key: string;
  expiresIn: number;
};

export type MeshParquetDeps = {
  requestGrant: (storeId: string) => Promise<ParquetGrant>;
  requestRegion: () => Promise<string>;
  datalayerEndpoint?: string;
};

const escapeSqlLiteral = (value: string) => `'${value.replaceAll("'", "''")}'`;

const secretName = (storeId: string) => `mesh_store_${storeId.replaceAll(/[^a-zA-Z0-9_]/g, "_")}`;

const toUint8 = (value: unknown): Uint8Array => {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  throw new Error(`expected binary column, got ${typeof value}`);
};

const toCount = (value: unknown): number => {
  const n = typeof value === "bigint" ? Number(value) : Number(value ?? 0);
  if (!Number.isFinite(n)) throw new Error(`expected numeric column, got ${String(value)}`);
  return n;
};

export type FetchedGeometryRow = MeshGeometryRow & { level: number; cell: number };

export class MeshParquetSource {
  private grants = new Map<string, ParquetGrant & { expiresAt: number }>();
  private region: string | null = null;
  private cellIndexPromise: Promise<MeshCellRecord[]> | null = null;

  constructor(
    private readonly geometryStores: readonly ParquetStoreRef[],
    private readonly deps: MeshParquetDeps,
  ) {}

  private geometryUrls(): string[] {
    return this.geometryStores.map((store) => `s3://${store.bucket}/${store.key}`);
  }

  private fromClause(): string {
    const urls = this.geometryUrls().map((url) => escapeSqlLiteral(url));
    return `FROM read_parquet([${urls.join(", ")}])`;
  }

  private async ensureSecrets(connection: {
    query: (sql: string) => Promise<unknown>;
  }): Promise<void> {
    if (this.region === null) this.region = await this.deps.requestRegion();
    const duckDbEndpoint = resolveDuckDbEndpoint(this.deps.datalayerEndpoint);

    await Promise.all(
      this.geometryStores.map(async (store) => {
        const cached = this.grants.get(store.id);
        const grant =
          cached && cached.expiresAt > Date.now() + 60_000
            ? cached
            : {
                ...(await this.deps.requestGrant(store.id)),
                expiresAt: 0,
              };
        if (grant.expiresAt === 0) {
          grant.expiresAt = Date.now() + grant.expiresIn * 1000;
          this.grants.set(store.id, grant);
        } else {
          return; // secret for this grant already exists and is fresh
        }

        const options = [
          "TYPE s3",
          "PROVIDER config",
          `KEY_ID ${escapeSqlLiteral(grant.accessKey)}`,
          `SECRET ${escapeSqlLiteral(grant.secretKey)}`,
          `SESSION_TOKEN ${escapeSqlLiteral(grant.sessionToken)}`,
          `REGION ${escapeSqlLiteral(this.region ?? "us-east-1")}`,
          `SCOPE ${escapeSqlLiteral(`s3://${grant.bucket}/${grant.key}`)}`,
        ];
        if (duckDbEndpoint) {
          options.push(`ENDPOINT ${escapeSqlLiteral(duckDbEndpoint.endpoint)}`);
          options.push(`URL_STYLE ${escapeSqlLiteral("path")}`);
          options.push(`USE_SSL ${escapeSqlLiteral(duckDbEndpoint.useSsl ? "true" : "false")}`);
        }
        await connection.query(
          `CREATE OR REPLACE SECRET "${secretName(store.id)}" (${options.join(", ")})`,
        );
      }),
    );
  }

  private async withConnection<T>(
    run: (connection: { query: (sql: string) => Promise<{ toArray: () => unknown[] }> }) => Promise<T>,
  ): Promise<T> {
    const db = await getDuckDb();
    const connection = await db.connect();
    try {
      await ensureHttpfs(connection);
      await this.ensureSecrets(connection);
      return await run(connection);
    } finally {
      await connection.close();
    }
  }

  /** The per-cell index: one projected aggregate scan, memoized per instance. */
  loadCellIndex(): Promise<MeshCellRecord[]> {
    if (!this.cellIndexPromise) {
      this.cellIndexPromise = this.withConnection(async (connection) => {
        const result = await connection.query(
          `SELECT level, cell, SUM(vertex_count) AS vertex_count, SUM(index_count) AS index_count ` +
            `${this.fromClause()} GROUP BY level, cell`,
        );
        return result.toArray().map((row) => {
          const record = row as Record<string, unknown>;
          return {
            level: toCount(record.level),
            cell: toCount(record.cell),
            vertexCount: toCount(record.vertex_count),
            indexCount: toCount(record.index_count),
          };
        });
      }).catch((error) => {
        this.cellIndexPromise = null; // allow retry after transient failures
        throw error;
      });
    }
    return this.cellIndexPromise;
  }

  /** Batched geometry fetch for one level's planned cells. */
  async fetchCellRows(level: number, cells: readonly number[]): Promise<FetchedGeometryRow[]> {
    if (cells.length === 0) return [];
    const cellList = cells.map((cell) => String(cell)).join(", ");
    return this.withConnection(async (connection) => {
      const result = await connection.query(
        `SELECT level, cell, positions, normals, indices, vertex_count, index_count ` +
          `${this.fromClause()} WHERE level = ${level} AND cell IN (${cellList})`,
      );
      return result.toArray().map((row) => {
        const record = row as Record<string, unknown>;
        return {
          level: toCount(record.level),
          cell: toCount(record.cell),
          positions: toUint8(record.positions),
          normals: record.normals == null ? null : toUint8(record.normals),
          indices: toUint8(record.indices),
          vertexCount: toCount(record.vertex_count),
          indexCount: toCount(record.index_count),
        };
      });
    });
  }
}
