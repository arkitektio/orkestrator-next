import type {
  AttributeColumnLike,
  AttributePlanLike,
  AttributeRow,
  ParquetStoreLike,
} from "./attributeTypes";
import { planIdentity } from "./attributeTypes";
import { LruMap } from "./lruMap";
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
 *    consumers and the table UI's global secret never clobber each other.
 *    Grant/region round-trips run OFF the query chain (network overlaps
 *    queued DuckDB work); only the `CREATE SECRET` SQL is serialized, and a
 *    grant is recorded as installed only after that SQL succeeds;
 *  - a prepared-statement LRU keyed by plan identity, with a runtime-probed
 *    fallback to escaped-literal SQL for builds that cannot prepare
 *    `read_parquet(?)`. A statement that has answered before is PROVEN: its
 *    later failures are real errors and surface as such — only a first-use
 *    failure downgrades the build to literal SQL;
 *  - a result LRU keyed `(plan identity, key tuple)` — hovering anywhere
 *    inside one object hits it without touching DuckDB. Parquet contents
 *    changing deliberately does NOT invalidate (per the plan contract; a
 *    version-bumped edge changes the key instead);
 *  - all queries serialized on an internal chain, with staleness checks both
 *    before and after the connection/secret legs so a superseded hover never
 *    issues SQL;
 *  - `warm(plan)` pre-pays a plan's fixed costs (connection, secret,
 *    prepared statement) without querying, so the first hover pays only the
 *    row read.
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

/** Unambiguous result-LRU key: strings are quoted so values never collide. */
const resultKey = (statementKey: string, keyValues: readonly BindParam[]): string =>
  `${statementKey}|${keyValues
    .map((value) => (typeof value === "string" ? JSON.stringify(value) : String(value)))
    .join(",")}`;

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

type StoredGrant = ParquetGrantLike & { expiresAt: number };

type StatementEntry = {
  statement: PreparedStatementLike;
  /** A query has succeeded on it — later failures are real, not capability gaps. */
  proven: boolean;
};

export class AttributeLookupEngine {
  private connectionPromise: Promise<DuckConnectionLike> | null = null;
  private chain: Promise<unknown> = Promise.resolve();
  private regionPromise: Promise<string> | null = null;
  private region: string | null = null;
  /** Store id → freshest settled grant (network result, chain-free). */
  private grants = new Map<string, StoredGrant>();
  /** Store id → inflight grant fetch, so concurrent misses share one request. */
  private grantFetches = new Map<string, Promise<StoredGrant>>();
  /** Store id → the grant whose scoped secret is INSTALLED on the connection. */
  private installedSecrets = new Map<string, StoredGrant>();
  private statements = new LruMap<StatementEntry>(STATEMENT_LRU_SIZE, (entry) => {
    void entry.statement.close().catch(() => undefined);
  });
  private results = new LruMap<readonly AttributeRow[]>(RESULT_LRU_SIZE);
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
   * Synchronous result-LRU lookup: the rows for `(plan, held)` if this
   * session already ran that lookup — no connection, no query, no promise.
   * Powers the tracker's instant repeat-hover path (re-hovering an object
   * whose key tuple was already answered must not wait out the debounce).
   * Null on a miss OR when `held` does not cover the key columns.
   */
  peek(
    plan: AttributePlanLike,
    held: Record<string, HeldValue>,
  ): readonly AttributeRow[] | null {
    const keyValues = buildKeyValues(plan, held);
    if (keyValues === null) return null;
    return this.results.get(resultKey(planIdentity(plan), keyValues)) ?? null;
  }

  /**
   * Pre-pay a plan's fixed costs — connection, scoped secret, prepared
   * statement — without running a query, so the first real lookup pays only
   * the row read. Cheap to call repeatedly: a fully-warm plan returns
   * synchronously, and failures are silent (the lookup path re-attempts and
   * surfaces them properly).
   */
  warm(plan: AttributePlanLike): void {
    if (this.disposed) return;
    const store = plan.lookup.store;
    const grant = this.grants.get(store.id);
    const secretFresh =
      grant !== undefined &&
      this.installedSecrets.get(store.id) === grant &&
      grant.expiresAt > Date.now() + GRANT_EXPIRY_SKEW_MS;
    const statementReady =
      this.preferLiteral || this.statements.get(planIdentity(plan)) !== undefined;
    if (secretFresh && statementReady) return;

    const grantReady = this.grantFor(store);
    grantReady.catch(() => undefined);
    void this.enqueue(async () => {
      if (this.disposed) return;
      const connection = await this.ensureConnection();
      await this.installSecret(connection, store, await grantReady);
      if (!this.preferLiteral) {
        await this.ensureStatement(
          connection,
          planIdentity(plan),
          plan.lookup.sql,
        ).catch(() => undefined);
      }
    }).catch(() => undefined);
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
    let ref: ReturnType<AttributeLookupEngine["referenceLookup"]>;
    try {
      ref = this.referenceLookup(column);
    } catch (error) {
      return Promise.reject(error);
    }
    return this.cachedQuery(ref.key, ref.sql, [value], ref.store, () => false);
  }

  /**
   * Synchronous result-LRU peek of an already-followed reference — re-opening
   * an expand the session has answered before costs nothing.
   */
  peekReference(
    column: AttributeColumnLike,
    value: HeldValue,
  ): readonly AttributeRow[] | null {
    const target = column.references;
    if (!target) return null;
    return this.results.get(resultKey(`ref:${target.id}`, [value])) ?? null;
  }

  dispose(): void {
    this.disposed = true;
    const statements = this.statements.drain();
    this.results.drain();
    this.inflight.clear();
    this.grants.clear();
    this.grantFetches.clear();
    this.installedSecrets.clear();
    const connection = this.connectionPromise;
    this.connectionPromise = null;
    void this.chain
      .catch(() => undefined)
      .then(async () => {
        for (const entry of statements) {
          await entry.statement.close().catch(() => undefined);
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
    const cacheKey = resultKey(statementKey, keyValues);
    const cached = this.results.get(cacheKey);
    if (cached !== undefined) return Promise.resolve(cached);
    const running = this.inflight.get(cacheKey);
    if (running !== undefined) return running;

    // Kick the grant fetch NOW, off the chain: the token round-trip overlaps
    // whatever queued DuckDB work precedes this query instead of stalling it.
    const grantReady = this.grantFor(store);
    grantReady.catch(() => undefined); // observed again inside the task

    const task = this.enqueue(async () => {
      if (this.disposed || isStale()) return null;
      const again = this.results.get(cacheKey);
      if (again !== undefined) return again;
      const connection = await this.ensureConnection();
      const grant = await grantReady;
      await this.installSecret(connection, store, grant);
      // The connection/secret legs can await network; a request superseded
      // meanwhile must still never issue SQL.
      if (this.disposed || isStale()) return null;
      const params: BindParam[] = [grantUrl(grant), ...keyValues];
      const rows = await this.runQuery(connection, statementKey, sql, params);
      this.results.set(cacheKey, rows);
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

  /**
   * The store's access grant — network only, deduped, never on the query
   * chain. Region and grant are requested in PARALLEL (the region is the
   * same for every store and memoized after the first resolve). A grant
   * within the expiry skew of running out is refetched.
   */
  private grantFor(store: ParquetStoreLike): Promise<StoredGrant> {
    const cached = this.grants.get(store.id);
    if (cached && cached.expiresAt > Date.now() + GRANT_EXPIRY_SKEW_MS) {
      return Promise.resolve(cached);
    }
    let fetching = this.grantFetches.get(store.id);
    if (!fetching) {
      this.regionPromise ??= this.deps
        .requestRegion()
        .then((region) => {
          this.region = region;
          return region;
        })
        .catch((error) => {
          this.regionPromise = null; // do not cache failures
          throw error;
        });
      fetching = Promise.all([this.deps.requestGrant(store.id), this.regionPromise])
        .then(([grant]) => {
          const stored: StoredGrant = {
            ...grant,
            expiresAt: Date.now() + grant.expiresIn * 1000,
          };
          this.grants.set(store.id, stored);
          return stored;
        })
        .finally(() => {
          this.grantFetches.delete(store.id);
        });
      this.grantFetches.set(store.id, fetching);
    }
    return fetching;
  }

  /**
   * Install the store's scoped secret for `grant` unless that exact grant is
   * already the one on the connection. SQL only — runs inside the chain; the
   * network half happened in `grantFor`. Recorded as installed only AFTER
   * the CREATE succeeds, so a failed CREATE never leaves an hour-long
   * "secret exists" illusion behind.
   */
  private async installSecret(
    connection: DuckConnectionLike,
    store: ParquetStoreLike,
    grant: StoredGrant,
  ): Promise<void> {
    if (this.installedSecrets.get(store.id) === grant) return;
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
    this.installedSecrets.set(store.id, grant);
  }

  private async runQuery(
    connection: DuckConnectionLike,
    statementKey: string,
    sql: string,
    params: readonly BindParam[],
  ): Promise<readonly AttributeRow[]> {
    if (!this.preferLiteral) {
      let entry: StatementEntry | null = null;
      try {
        entry = await this.ensureStatement(connection, statementKey, sql);
      } catch {
        // This build cannot prepare the SQL (`read_parquet(?)` unsupported):
        // a capability gap, fall through to literal.
      }
      if (entry) {
        try {
          const result = await entry.statement.query(...params);
          entry.proven = true;
          return result.toArray().map((row) => rowToRecord(row));
        } catch (error) {
          this.statements.take(statementKey);
          // A statement that has answered before failing now is a REAL error
          // (network, credentials) and must surface — only a first-use
          // failure (bigint binding, placeholder support) means the build
          // cannot prepare, which the literal fallback below probes.
          if (entry.proven) throw error;
        }
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
  ): Promise<StatementEntry> {
    const cached = this.statements.get(statementKey);
    if (cached) return cached;
    const entry: StatementEntry = {
      statement: await connection.prepare(sql),
      proven: false,
    };
    this.statements.set(statementKey, entry);
    return entry;
  }

  /** The SQL, statement key, and store for a column's declared reference. */
  private referenceLookup(column: AttributeColumnLike): {
    key: string;
    sql: string;
    store: ParquetStoreLike;
  } {
    const target = column.references;
    if (!target) {
      throw new Error(`column ${column.name} references nothing`);
    }
    const keyColumn = target.columns.find(
      (candidate) =>
        candidate.role === "COORDINATE" && candidate.axisType === "INDEX",
    );
    if (!keyColumn) {
      throw new Error(`referenced table ${target.name} has no INDEX key column`);
    }
    const attributes = target.columns.filter(
      (candidate) => candidate.role !== "COORDINATE",
    );
    const selectList = attributes.length
      ? attributes.map((attr) => escapeSqlIdentifier(attr.name)).join(", ")
      : "*";
    return {
      key: `ref:${target.id}`,
      sql: `SELECT ${selectList} FROM read_parquet(?) WHERE ${escapeSqlIdentifier(keyColumn.name)} = ?`,
      store: target.store,
    };
  }
}
