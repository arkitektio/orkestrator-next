import type { SortingState } from "@tanstack/react-table";
import * as duckdb from "@duckdb/duckdb-wasm";
import duckdbEhWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import duckdbMvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdbEhWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import duckdbMvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import { useEffect, useRef, useState } from "react";

import {
  type TableFragment,
  useRequestGeneralParquetAccessMutation,
} from "@/mikro-next/api/graphql";

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

type DuckDbTableState = {
  rows: Record<string, unknown>[];
  totalRowCount: number;
  loading: boolean;
  error: Error | null;
};

type CachedGrant = {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
  region: string;
  bucket: string;
  expiresAt: number;
};

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: duckdbMvpWorker,
  },
  eh: {
    mainModule: duckdbEhWasm,
    mainWorker: duckdbEhWorker,
  },
};

let duckDbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

const escapeSqlIdentifier = (value: string) =>
  `"${value.replaceAll('"', '""')}"`;

const escapeSqlLiteral = (value: string) =>
  `'${value.replaceAll("'", "''")}'`;

const resolveParquetKey = (table: TableFragment) => {
  if (table.store.key) {
    return table.store.key;
  }

  return table.store.path.replace(/^\/+/, "");
};

const resolveParquetUrl = (table: TableFragment, bucket: string) =>
  `s3://${bucket}/${resolveParquetKey(table)}`;

const normalizeValue = (value: unknown): unknown => {
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    return Number.isSafeInteger(asNumber) ? asNumber : value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeValue(entry));
  }

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

const rowToRecord = (row: unknown): Record<string, unknown> => {
  if (
    row &&
    typeof row === "object" &&
    "toJSON" in row &&
    typeof row.toJSON === "function"
  ) {
    return normalizeValue(row.toJSON()) as Record<string, unknown>;
  }

  return normalizeValue((row ?? {}) as Record<string, unknown>) as Record<
    string,
    unknown
  >;
};

const getDuckDb = async () => {
  if (!duckDbPromise) {
    duckDbPromise = (async () => {
      const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
      const worker = new Worker(bundle.mainWorker!);
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);

      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      await db.open({
        query: {
          castBigIntToDouble: true,
          castDecimalToDouble: true,
          castTimestampToDate: true,
        },
      });

      return db;
    })();
  }

  return duckDbPromise;
};

const buildSearchClause = (table: TableFragment, search: string) => {
  const trimmedSearch = search.trim();
  if (!trimmedSearch) {
    return "";
  }

  const escapedSearch = escapeSqlLiteral(`%${trimmedSearch}%`);
  const searchableColumns = table.columns.map(
    (column) =>
      `TRY_CAST(${escapeSqlIdentifier(column.name)} AS VARCHAR) ILIKE ${escapedSearch}`,
  );

  return searchableColumns.length
    ? `WHERE (${searchableColumns.join(" OR ")})`
    : "";
};

const buildSortingClause = (sorting: SortingState) => {
  const primarySort = sorting[0];
  if (!primarySort) {
    return "";
  }

  return `ORDER BY ${escapeSqlIdentifier(primarySort.id)} ${primarySort.desc ? "DESC" : "ASC"}`;
};

const buildCountQuery = (table: TableFragment, bucket: string, search: string) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(resolveParquetUrl(table, bucket))})`;
  const searchClause = buildSearchClause(table, search);
  return `SELECT COUNT(*) AS total_row_count ${fromClause} ${searchClause}`;
};

const buildRowsQuery = (
  table: TableFragment,
  bucket: string,
  search: string,
  sorting: SortingState,
  pageIndex: number,
  pageSize: number,
) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(resolveParquetUrl(table, bucket))})`;
  const searchClause = buildSearchClause(table, search);
  const sortingClause = buildSortingClause(sorting);
  const offset = pageIndex * pageSize;

  return [
    `SELECT * ${fromClause}`,
    searchClause,
    sortingClause,
    `LIMIT ${pageSize}`,
    `OFFSET ${offset}`,
  ]
    .filter(Boolean)
    .join(" ");
};

const applyS3Settings = async (
  connection: duckdb.AsyncDuckDBConnection,
  grant: CachedGrant,
) => {
  await connection.query(`SET s3_region=${escapeSqlLiteral(grant.region)}`);
  await connection.query(
    `SET s3_access_key_id=${escapeSqlLiteral(grant.accessKey)}`,
  );
  await connection.query(
    `SET s3_secret_access_key=${escapeSqlLiteral(grant.secretKey)}`,
  );
  await connection.query(
    `SET s3_session_token=${escapeSqlLiteral(grant.sessionToken)}`,
  );
};

export const useDuckDbTable = ({
  table,
  pagination,
  sorting,
  search,
}: {
  table: TableFragment;
  pagination: PaginationState;
  sorting: SortingState;
  search: string;
}): DuckDbTableState => {
  const [requestGeneralParquetAccess] = useRequestGeneralParquetAccessMutation();
  const grantRef = useRef<CachedGrant | null>(null);
  const [state, setState] = useState<DuckDbTableState>({
    rows: [],
    totalRowCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const ensureGrant = async () => {
      const cachedGrant = grantRef.current;
      if (cachedGrant && cachedGrant.expiresAt > Date.now() + 30_000) {
        return cachedGrant;
      }

      const response = await requestGeneralParquetAccess({
        variables: { input: {} },
      });
      const grant = response.data?.requestGeneralParquetAccess;

      if (!grant) {
        throw new Error("Failed to request general parquet access");
      }

      const resolvedGrant: CachedGrant = {
        accessKey: grant.accessKey,
        secretKey: grant.secretKey,
        sessionToken: grant.sessionToken,
        region: grant.region,
        bucket: grant.bucket,
        expiresAt: Date.now() + grant.expiresIn * 1000,
      };

      grantRef.current = resolvedGrant;
      return resolvedGrant;
    };

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: null }));

      let connection: duckdb.AsyncDuckDBConnection | null = null;

      try {
        const db = await getDuckDb();
        const grant = await ensureGrant();

        connection = await db.connect();
        await applyS3Settings(connection, grant);

        const [countResult, rowsResult] = await Promise.all([
          connection.query(buildCountQuery(table, grant.bucket, search)),
          connection.query(
            buildRowsQuery(
              table,
              grant.bucket,
              search,
              sorting,
              pagination.pageIndex,
              pagination.pageSize,
            ),
          ),
        ]);

        const totalRow = rowToRecord(countResult.toArray()[0]);
        const totalRowCount = Number(totalRow.total_row_count ?? 0);
        const rows = rowsResult.toArray().map((row) => rowToRecord(row));

        if (!cancelled) {
          setState({
            rows,
            totalRowCount,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            rows: [],
            totalRowCount: 0,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      } finally {
        if (connection) {
          await connection.close();
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    requestGeneralParquetAccess,
    search,
    sorting,
    table,
  ]);

  return state;
};
