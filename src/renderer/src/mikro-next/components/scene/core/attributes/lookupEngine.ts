import type {
  AttributeColumnLike,
  AttributePlanLike,
  AttributeRow,
  ParquetStoreLike,
} from "./attributeTypes";
import { planIdentity } from "./attributeTypes";
import type { BindParam, HeldValue } from "./planExec";
import { buildKeyValues } from "./planExec";
import { bindSqlLiteral, escapeSqlIdentifier, escapeSqlLiteral } from "./sqlBind";

/**
 * The DuckDB half of attribute-plan execution. Owns exactly what
 * `MeshParquetSource` owns for meshes — grants, scoped secrets, SQL, row
 * normalization — tuned for the hover loop:
 *
 *  - ONE persistent connection (prepared statements are connection-scoped,
 *    and DuckDB caches parquet footers per connection, so revisiting a table
 *    is range reads only);
 *  - per-store NAMED + SCOPED secrets (`attr_store_<id>`), so concurrent
 *    consumers and the table UI's global secret never clobber each other;
 *  - a prepared-statement LRU keyed by plan identity, with a runtime-probed
 *    fallback to escaped-literal SQL for builds that cannot prepare
 *    `read_parquet(?)`;
 *  - a result LRU keyed `(plan identity, key tuple)` — hovering anywhere
 *    inside one object hits it without touching DuckDB. Parquet contents
 *    changing deliberately does NOT invalidate (per the plan contract; a
 *    version-bumped edge changes the key instead);
 *  - all queries serialized on an internal chain, with a staleness check
 *    before each so a superseded hover never issues SQL.
 *
 * Dependency-injected (no imports from React, Apollo, or duckdb-wasm) so unit
 * tests drive it with a fake connection.
 */

export type QueryResultLike = { toArray: () => unknown[] };

export type PreparedStatementLike = {
  query: (...params: unknown[]) => Promise<QueryResultLike>;
  close: () => Promise<void>;
};

export type DuckConnectionLike = {
  query: (sql: string) => Promise<QueryResultLike>;
  prepare: (sql: string) => Promise<PreparedStatementLike>;
  close: () => Promise<void>;
};

export type ParquetGrantLike = {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
  bucket: string;
  key: string;
  expiresIn: number;
};

export type LookupEngineDeps = {
  /** Open a connection on the shared DuckDB with httpfs already loaded. */
  connect: () => Promise<DuckConnectionLike>;
  requestGrant: (storeId: string) => Promise<ParquetGrantLike>;
  requestRegion: () => Promise<string>;
  /** Datalayer S3 endpoint (resolveDuckDbEndpoint shape); null = AWS default. */
  endpoint?: { endpoint: string; useSsl: boolean } | null;
};

const RESULT_LRU_SIZE = 256;
const STATEMENT_LRU_SIZE = 32;
const GRANT_EXPIRY_SKEW_MS = 60_000;

const secretName = (storeId: string) =>
  `attr_store_${storeId.replaceAll(/[^a-zA-Z0-9_]/g, "_")}`;

/**
 * The queried URL comes from the GRANT, never from the store's declared
 * bucket/key: the secret is scoped to the grant's `s3://bucket/key`, and a
 * URL built from anything else can silently miss that scope — DuckDB then
 * falls back to its default AWS endpoint (the classic
 * `https://<bucket>.s3.amazonaws.com` CORS failure). One source, no mismatch.
 */
const grantUrl = (grant: ParquetGrantLike) => `s3://${grant.bucket}/${grant.key}`;

const normalizeValue = (value: unknown): unknown => {
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    return Number.isSafeInteger(asNumber) ? asNumber : value.toString();
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((entry) => normalizeValue(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        normalizeValue(entry),
      ]),
    );
  }
  return value;
};

const rowToRecord = (row: unknown): AttributeRow => {
  if (
    row &&
    typeof row === "object" &&
    "toJSON" in row &&
    typeof (row as { toJSON: unknown }).toJSON === "function"
  ) {
    return normalizeValue((row as { toJSON: () => unknown }).toJSON()) as AttributeRow;
  }
  return normalizeValue((row ?? {}) as Record<string, unknown>) as AttributeRow;
};

export class AttributeLookupEngine {
  private connectionPromise: Promise<DuckConnectionLike> | null = null;
  private chain: Promise<unknown> = Promise.resolve();
  private grants = new Map<string, ParquetGrantLike & { expiresAt: number }>();
  private region: string | null = null;
  private statements = new Map<string, PreparedStatementLike>();
  private results = new Map<string, readonly AttributeRow[]>();
  private inflight = new Map<string, Promise<readonly AttributeRow[] | null>>();
  /** Flipped when this build cannot prepare the plan SQL; probed at runtime. */
  private preferLiteral = false;
  private disposed = false;

  constructor(private readonly deps: LookupEngineDeps) {}

  /**
   * Run one plan's lookup for the held values. Returns the normalized rows
   * (plural — 0..n is the contract), or null when `isStale` cut it short.
   * Throws when a key axis is missing from `held` (a contract violation the
   * caller surfaces as unreachable, never queries around).
   */
  lookup(
    plan: AttributePlanLike,
    held: Record<string, HeldValue>,
    isStale: () => boolean = () => false,
  ): Promise<readonly AttributeRow[] | null> {
    const keyValues = buildKeyValues(plan, held);
    if (keyValues === null) {
      return Promise.reject(
        new Error("held values do not cover the plan's key columns"),
      );
    }
    return this.cachedQuery(
      planIdentity(plan),
      plan.lookup.sql,
      keyValues,
      plan.lookup.store,
      isStale,
    );
  }

  /**
   * The one-hop foreign-key follow: look a returned value up in the table the
   * column `references`. Never on the hover path — the UI calls this on
   * expand. The target is keyed by its single INDEX coordinate column.
   */
  followReference(
    column: AttributeColumnLike,
    value: HeldValue,
  ): Promise<readonly AttributeRow[] | null> {
    const target = column.references;
    if (!target) {
      return Promise.reject(new Error(`column ${column.name} references nothing`));
    }
    const keyColumn = target.columns.find(
      (candidate) =>
        candidate.role === "COORDINATE" && candidate.axisType === "INDEX",
    );
    if (!keyColumn) {
      return Promise.reject(
        new Error(`referenced table ${target.name} has no INDEX key column`),
      );
    }
    const attributes = target.columns.filter(
      (candidate) => candidate.role !== "COORDINATE",
    );
    const selectList = attributes.length
      ? attributes.map((attr) => escapeSqlIdentifier(attr.name)).join(", ")
      : "*";
    const sql = `SELECT ${selectList} FROM read_parquet(?) WHERE ${escapeSqlIdentifier(keyColumn.name)} = ?`;
    return this.cachedQuery(`ref:${target.id}`, sql, [value], target.store, () => false);
  }

  dispose(): void {
    this.disposed = true;
    const statements = [...this.statements.values()];
    this.statements.clear();
    this.results.clear();
    this.inflight.clear();
    const connection = this.connectionPromise;
    this.connectionPromise = null;
    void this.chain
      .catch(() => undefined)
      .then(async () => {
        for (const statement of statements) {
          await statement.close().catch(() => undefined);
        }
        if (connection) {
          await connection.then((c) => c.close()).catch(() => undefined);
        }
      });
  }

  // ---- internals ----------------------------------------------------------

  private cachedQuery(
    statementKey: string,
    sql: string,
    keyValues: readonly BindParam[],
    store: ParquetStoreLike,
    isStale: () => boolean,
  ): Promise<readonly AttributeRow[] | null> {
    const cacheKey = `${statementKey}|${keyValues.map(String).join(",")}`;
    const cached = this.results.get(cacheKey);
    if (cached !== undefined) {
      // Refresh LRU recency.
      this.results.delete(cacheKey);
      this.results.set(cacheKey, cached);
      return Promise.resolve(cached);
    }
    const running = this.inflight.get(cacheKey);
    if (running !== undefined) return running;

    const task = this.enqueue(async () => {
      if (this.disposed || isStale()) return null;
      const again = this.results.get(cacheKey);
      if (again !== undefined) return again;
      const connection = await this.ensureConnection();
      const grant = await this.ensureSecret(connection, store);
      const params: BindParam[] = [grantUrl(grant), ...keyValues];
      const rows = await this.runQuery(connection, statementKey, sql, params);
      this.rememberResult(cacheKey, rows);
      return rows;
    }).finally(() => {
      this.inflight.delete(cacheKey);
    });
    this.inflight.set(cacheKey, task);
    return task;
  }

  /** Serialize DuckDB work; a failed task never breaks the chain. */
  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.chain.then(task, task);
    this.chain = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private ensureConnection(): Promise<DuckConnectionLike> {
    if (!this.connectionPromise) {
      this.connectionPromise = this.deps.connect().catch((error) => {
        this.connectionPromise = null;
        throw error;
      });
    }
    return this.connectionPromise;
  }

  private async ensureSecret(
    connection: DuckConnectionLike,
    store: ParquetStoreLike,
  ): Promise<ParquetGrantLike> {
    const cached = this.grants.get(store.id);
    if (cached && cached.expiresAt > Date.now() + GRANT_EXPIRY_SKEW_MS) {
      return cached; // Secret for this grant already exists and is fresh.
    }
    if (this.region === null) this.region = await this.deps.requestRegion();
    const grant = {
      ...(await this.deps.requestGrant(store.id)),
      expiresAt: 0,
    };
    grant.expiresAt = Date.now() + grant.expiresIn * 1000;
    this.grants.set(store.id, grant);

    const options = [
      "TYPE s3",
      "PROVIDER config",
      `KEY_ID ${escapeSqlLiteral(grant.accessKey)}`,
      `SECRET ${escapeSqlLiteral(grant.secretKey)}`,
      `SESSION_TOKEN ${escapeSqlLiteral(grant.sessionToken)}`,
      `REGION ${escapeSqlLiteral(this.region ?? "us-east-1")}`,
      `SCOPE ${escapeSqlLiteral(grantUrl(grant))}`,
    ];
    const endpoint = this.deps.endpoint;
    if (endpoint) {
      options.push(`ENDPOINT ${escapeSqlLiteral(endpoint.endpoint)}`);
      options.push(`URL_STYLE ${escapeSqlLiteral("path")}`);
      options.push(`USE_SSL ${escapeSqlLiteral(endpoint.useSsl ? "true" : "false")}`);
    }
    await connection.query(
      `CREATE OR REPLACE SECRET "${secretName(store.id)}" (${options.join(", ")})`,
    );
    return grant;
  }

  private async runQuery(
    connection: DuckConnectionLike,
    statementKey: string,
    sql: string,
    params: readonly BindParam[],
  ): Promise<readonly AttributeRow[]> {
    if (!this.preferLiteral) {
      try {
        const statement = await this.ensureStatement(connection, statementKey, sql);
        const result = await statement.query(...params);
        return result.toArray().map((row) => rowToRecord(row));
      } catch {
        // Prepared `read_parquet(?)` (or bigint binding) unsupported on this
        // build — fall through to literal SQL; if THAT succeeds, remember.
        this.dropStatement(statementKey);
      }
    }
    const result = await connection.query(bindSqlLiteral(sql, params));
    this.preferLiteral = true;
    return result.toArray().map((row) => rowToRecord(row));
  }

  private async ensureStatement(
    connection: DuckConnectionLike,
    statementKey: string,
    sql: string,
  ): Promise<PreparedStatementLike> {
    const cached = this.statements.get(statementKey);
    if (cached) {
      // Refresh LRU recency.
      this.statements.delete(statementKey);
      this.statements.set(statementKey, cached);
      return cached;
    }
    const statement = await connection.prepare(sql);
    this.statements.set(statementKey, statement);
    if (this.statements.size > STATEMENT_LRU_SIZE) {
      const oldest = this.statements.keys().next().value;
      if (oldest !== undefined) this.dropStatement(oldest);
    }
    return statement;
  }

  private dropStatement(statementKey: string): void {
    const statement = this.statements.get(statementKey);
    if (!statement) return;
    this.statements.delete(statementKey);
    void statement.close().catch(() => undefined);
  }

  private rememberResult(cacheKey: string, rows: readonly AttributeRow[]): void {
    this.results.set(cacheKey, rows);
    if (this.results.size > RESULT_LRU_SIZE) {
      const oldest = this.results.keys().next().value;
      if (oldest !== undefined) this.results.delete(oldest);
    }
  }
}
