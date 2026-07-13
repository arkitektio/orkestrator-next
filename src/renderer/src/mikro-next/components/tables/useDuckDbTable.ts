import type { SortingState } from "@tanstack/react-table";
import * as duckdb from "@duckdb/duckdb-wasm";
import duckdbEhWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import duckdbMvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdbEhWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import duckdbMvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  type TableFragment,
  useRequestParquetAccessMutation,
  useRequestGeneralParquetAccessMutation,
} from "@/mikro-next/api/graphql";
import { useDatalayerEndpoint } from "@/app/Arkitekt";

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

export type DuckDbColumnFilters = Record<string, string>;

export type DuckDbHistogramBucket = {
  value: string;
  count: number;
};

type DuckDbTableResult = DuckDbTableState & {
  loadColumnHistogram: (
    columnName: string,
    limit?: number,
  ) => Promise<DuckDbHistogramBucket[]>;
  exportAsCsv: (selectedColumns?: string[]) => Promise<string>;
};

type CachedGrant = {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
  region: string;
  bucket: string;
  key: string;
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
let httpfsReadyPromise: Promise<void> | null = null;

const escapeSqlIdentifier = (value: string) =>
  `"${value.replaceAll('"', '""')}"`;

const escapeSqlLiteral = (value: string) =>
  `'${value.replaceAll("'", "''")}'`;

const resolveParquetUrl = (grant: CachedGrant) =>
  `s3://${grant.bucket}/${grant.key}`;

export const resolveDuckDbEndpoint = (datalayerEndpoint?: string) => {
  if (!datalayerEndpoint) {
    return null;
  }

  const parsedEndpoint = new URL(datalayerEndpoint);
  const path = parsedEndpoint.pathname.replace(/\/+$/, "");

  return {
    endpoint: `${parsedEndpoint.host}${path === "/" ? "" : path}`,
    useSsl: parsedEndpoint.protocol === "https:",
  };
};

const buildCreateSecretQuery = (
  grant: CachedGrant,
  datalayerEndpoint?: string,
) => {
  const duckDbEndpoint = resolveDuckDbEndpoint(datalayerEndpoint);
  const secretOptions = [
    "TYPE s3",
    "PROVIDER config",
    `KEY_ID ${escapeSqlLiteral(grant.accessKey)}`,
    `SECRET ${escapeSqlLiteral(grant.secretKey)}`,
    `SESSION_TOKEN ${escapeSqlLiteral(grant.sessionToken)}`,
    `REGION ${escapeSqlLiteral(grant.region)}`,
  ];

  if (duckDbEndpoint) {
    secretOptions.push(`ENDPOINT ${escapeSqlLiteral(duckDbEndpoint.endpoint)}`);
    secretOptions.push(`URL_STYLE ${escapeSqlLiteral("path")}`);
    secretOptions.push(
      `USE_SSL ${escapeSqlLiteral(duckDbEndpoint.useSsl ? "true" : "false")}`,
    );
  }

  return [
    "CREATE OR REPLACE SECRET parquet_access (",
    secretOptions.join(",\n"),
    ")",
  ].join("\n");
};

const resolveHistogramValueExpression = (columnName: string) => {
  const identifier = escapeSqlIdentifier(columnName);
  return `COALESCE(TRY_CAST(${identifier} AS VARCHAR), '(null)')`;
};

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

// Intentional app-lifetime singleton: the DuckDB instance and its Web Worker are
// created once and reused for every table query (per-query connections are opened
// and closed by callers). We deliberately do NOT terminate the worker on component
// unmount — tables mount/unmount frequently and re-instantiating WASM each time is
// expensive. The single worker persists for the life of the renderer process.
// Exported (with ensureHttpfs) so other Parquet consumers — the scene's mesh
// collections (`scene/render/mesh/meshParquet.ts`) — share the one instance.
export const getDuckDb = async () => {
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

export const ensureHttpfs = async (connection: duckdb.AsyncDuckDBConnection) => {
  if (!httpfsReadyPromise) {
    httpfsReadyPromise = (async () => {
      await connection.query("INSTALL httpfs");
      await connection.query("LOAD httpfs");
    })().catch((error) => {
      httpfsReadyPromise = null;
      throw error;
    });
  }

  await httpfsReadyPromise;
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

const buildWhereClause = (
  table: TableFragment,
  search: string,
  columnFilters: DuckDbColumnFilters,
) => {
  const predicates: string[] = [];
  const globalSearchClause = buildSearchClause(table, search);

  if (globalSearchClause) {
    predicates.push(globalSearchClause.replace(/^WHERE\s+/u, ""));
  }

  Object.entries(columnFilters).forEach(([columnName, rawValue]) => {
    const trimmedValue = rawValue.trim();
    if (!trimmedValue) {
      return;
    }

    predicates.push(
      `TRY_CAST(${escapeSqlIdentifier(columnName)} AS VARCHAR) ILIKE ${escapeSqlLiteral(`%${trimmedValue}%`)}`,
    );
  });

  return predicates.length ? `WHERE ${predicates.join(" AND ")}` : "";
};

const buildSortingClause = (sorting: SortingState) => {
  if (!sorting.length) {
    return "";
  }

  return `ORDER BY ${sorting
    .map(
      (entry) =>
        `${escapeSqlIdentifier(entry.id)} ${entry.desc ? "DESC" : "ASC"}`,
    )
    .join(", ")}`;
};

const buildCountQuery = (
  table: TableFragment,
  parquetUrl: string,
  search: string,
  columnFilters: DuckDbColumnFilters,
) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(parquetUrl)})`;
  const whereClause = buildWhereClause(table, search, columnFilters);
  return `SELECT COUNT(*) AS total_row_count ${fromClause} ${whereClause}`;
};

const buildRowsQuery = (
  table: TableFragment,
  parquetUrl: string,
  search: string,
  columnFilters: DuckDbColumnFilters,
  sorting: SortingState,
  pageIndex: number,
  pageSize: number,
) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(parquetUrl)})`;
  const whereClause = buildWhereClause(table, search, columnFilters);
  const sortingClause = buildSortingClause(sorting);
  const offset = pageIndex * pageSize;

  return [
    `SELECT * ${fromClause}`,
    whereClause,
    sortingClause,
    `LIMIT ${pageSize}`,
    `OFFSET ${offset}`,
  ]
    .filter(Boolean)
    .join(" ");
};

const buildExportQuery = (
  table: TableFragment,
  parquetUrl: string,
  search: string,
  columnFilters: DuckDbColumnFilters,
  sorting: SortingState,
  selectedColumns?: string[],
) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(parquetUrl)})`;
  const whereClause = buildWhereClause(table, search, columnFilters);
  const sortingClause = buildSortingClause(sorting);
  const availableColumns = new Set(table.columns.map((column) => column.name));
  const exportColumns =
    selectedColumns?.filter((columnName) => availableColumns.has(columnName)) ??
    table.columns.map((column) => column.name);

  return [
    `SELECT ${exportColumns.map((columnName) => escapeSqlIdentifier(columnName)).join(", ")}`,
    fromClause,
    whereClause,
    sortingClause,
  ]
    .filter(Boolean)
    .join(" ");
};

const escapeCsvValue = (value: unknown) => {
  const normalized = normalizeValue(value);
  const text = normalized == null ? "" : String(normalized);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
};

const buildHistogramQuery = (
  table: TableFragment,
  parquetUrl: string,
  search: string,
  columnFilters: DuckDbColumnFilters,
  columnName: string,
  limit: number,
) => {
  const fromClause = `FROM read_parquet(${escapeSqlLiteral(parquetUrl)})`;
  const whereClause = buildWhereClause(table, search, columnFilters);
  const valueExpression = resolveHistogramValueExpression(columnName);

  return [
    `SELECT ${valueExpression} AS histogram_value, COUNT(*) AS histogram_count`,
    fromClause,
    whereClause,
    `GROUP BY ${valueExpression}`,
    "ORDER BY histogram_count DESC, histogram_value ASC",
    `LIMIT ${limit}`,
  ]
    .filter(Boolean)
    .join(" ");
};

export const useDuckDbTable = ({
  table,
  pagination,
  sorting,
  search,
  columnFilters,
}: {
  table: TableFragment;
  pagination: PaginationState;
  sorting: SortingState;
  search: string;
  columnFilters: DuckDbColumnFilters;
}): DuckDbTableResult => {
  const [requestParquetAccess] = useRequestParquetAccessMutation();
  const [requestGeneralParquetAccess] = useRequestGeneralParquetAccessMutation();
  const grantRef = useRef<CachedGrant | null>(null);
  const [state, setState] = useState<DuckDbTableState>({
    rows: [],
    totalRowCount: 0,
    loading: true,
    error: null,
  });
  const datalayer = useDatalayerEndpoint();

  const ensureGrant = useCallback(async () => {
    const cachedGrant = grantRef.current;
    if (cachedGrant && cachedGrant.expiresAt > Date.now() + 30_000) {
      return cachedGrant;
    }

    const [parquetResponse, generalResponse] = await Promise.all([
      requestParquetAccess({
        variables: { input: { storeId: table.store.id } },
      }),
      requestGeneralParquetAccess({
        variables: { input: {} },
      }),
    ]);
    const parquetGrant = parquetResponse.data?.requestParquetAccess;
    const generalGrant = generalResponse.data?.requestGeneralParquetAccess;

    if (!parquetGrant) {
      throw new Error("Failed to request parquet access");
    }

    if (!generalGrant) {
      throw new Error("Failed to request general parquet access");
    }

    const resolvedGrant: CachedGrant = {
      accessKey: parquetGrant.accessKey,
      secretKey: parquetGrant.secretKey,
      sessionToken: parquetGrant.sessionToken,
      region: generalGrant.region,
      bucket: parquetGrant.bucket,
      key: parquetGrant.key,
      expiresAt: Date.now() + parquetGrant.expiresIn * 1000,
    };

    grantRef.current = resolvedGrant;
    return resolvedGrant;
  }, [requestGeneralParquetAccess, requestParquetAccess, table.store.id]);

  const withDuckDbConnection = useCallback(
    async <T,>(run: (args: {
      connection: duckdb.AsyncDuckDBConnection;
      parquetUrl: string;
    }) => Promise<T>) => {
      const db = await getDuckDb();
      const grant = await ensureGrant();
      const parquetUrl = resolveParquetUrl(grant);
      const connection = await db.connect();

      try {
        await ensureHttpfs(connection);
        await connection.query(buildCreateSecretQuery(grant, datalayer));
        return await run({ connection, parquetUrl });
      } finally {
        await connection.close();
      }
    },
    [datalayer, ensureGrant],
  );

  const loadColumnHistogram = useCallback(
    async (columnName: string, limit = 8) => {
      const histogramRows = await withDuckDbConnection(async ({ connection, parquetUrl }) => {
        const result = await connection.query(
          buildHistogramQuery(
            table,
            parquetUrl,
            search,
            columnFilters,
            columnName,
            limit,
          ),
        );

        return result.toArray().map((row) => rowToRecord(row));
      });

      return histogramRows.map((row) => ({
        value: String(row.histogram_value ?? "(null)"),
        count: Number(row.histogram_count ?? 0),
      }));
    },
    [columnFilters, search, table, withDuckDbConnection],
  );

  const exportAsCsv = useCallback(
    async (selectedColumns?: string[]) => {
      const exportRows = await withDuckDbConnection(async ({ connection, parquetUrl }) => {
        const result = await connection.query(
          buildExportQuery(
            table,
            parquetUrl,
            search,
            columnFilters,
            sorting,
            selectedColumns,
          ),
        );

        return result.toArray().map((row) => rowToRecord(row));
      });

      const availableColumns = new Set(table.columns.map((column) => column.name));
      const exportColumns =
        selectedColumns?.filter((columnName) => availableColumns.has(columnName)) ??
        table.columns.map((column) => column.name);

      const headerRow = exportColumns.map((columnName) => escapeCsvValue(columnName)).join(",");
      const csvRows = exportRows.map((row) =>
        exportColumns.map((columnName) => escapeCsvValue(row[columnName])).join(","),
      );

      return [headerRow, ...csvRows].join("\n");
    },
    [columnFilters, search, sorting, table, withDuckDbConnection],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const [countResult, rowsResult] = await withDuckDbConnection(
          async ({ connection, parquetUrl }) =>
            Promise.all([
              connection.query(
                buildCountQuery(table, parquetUrl, search, columnFilters),
              ),
              connection.query(
                buildRowsQuery(
                  table,
                  parquetUrl,
                  search,
                  columnFilters,
                  sorting,
                  pagination.pageIndex,
                  pagination.pageSize,
                ),
              ),
            ]),
        );

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
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    columnFilters,
    withDuckDbConnection,
    search,
    sorting,
    table,
  ]);

  return {
    ...state,
    exportAsCsv,
    loadColumnHistogram,
  };
};
