import * as duckdb from "@duckdb/duckdb-wasm";
import duckdbEhWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import duckdbMvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdbEhWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import duckdbMvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";

/**
 * The renderer's ONE DuckDB-WASM instance, shared by every parquet consumer:
 * the tables UI, the scene's mesh collections (`scene/render/mesh/meshParquet`),
 * and the attribute lookup engine. Deliberate app-lifetime singletons — the
 * WASM VM and its Web Worker are created once and never terminated (consumers
 * mount/unmount frequently and re-instantiating WASM each time is expensive);
 * per-query connections are opened and closed by callers.
 */

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

/** The S3 endpoint options DuckDB secrets need, from the datalayer URL. */
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
