import type { MikroClient } from "@/lib/zarr/store/types";
import type { FabriksStoreFragment } from "@/mikro-next/api/graphql";
import { buildS3FetchConfig, getGeneralAccess } from "@/mikro-next/lib/zarr/access";
import { FabriksCollection } from "./fabriksCollection";
import { FabriksStore } from "./fabriksStore";

/**
 * From an API `MeshCollection` node to an open fabriks collection.
 *
 * The only file that knows how the API describes a collection, so a schema
 * change lands here and nowhere else.
 *
 * A collection names ONE store: a prefix holding `fabriks.json`, both catalogs
 * and every octree level, with a single grant covering all of it. That is why
 * the store is structurally a `ZarrStore` (whose `key` is a prefix) rather
 * than a `ParquetStore` (whose `key` is one object) — and why
 * `buildS3FetchConfig`, written for prefix stores, takes it unchanged.
 */

export type FabriksCollectionRef = {
  id: string;
  store: FabriksStoreFragment;
};

/**
 * Open a collection for reading.
 *
 * **No S3 round trip.** The server read `fabriks.json` at registration and
 * mirrors it onto the store node, so the grid, the encoding and every file's
 * byte length are already in hand — and the byte lengths are the one thing a
 * reader cannot otherwise discover, since a Parquet footer sits at the end of
 * a file and the transport speaks get/get-range only.
 *
 * The mirrored object is still validated like any manifest: a server that
 * mirrors something this reader cannot read is refused rather than trusted.
 * When the mirror is absent — an older server, or a store registered before
 * the fields existed — this falls back to fetching the manifest itself.
 */
export async function openFabriksCollection(
  collection: FabriksCollectionRef,
  client: MikroClient,
  datalayer: string,
): Promise<FabriksCollection> {
  const node = collection.store;
  const grant = await getGeneralAccess(client, { kind: "fabriks" });

  const descriptor = { key: node.key, storeId: node.id };
  const store = new FabriksStore({
    config: buildS3FetchConfig(grant, descriptor, datalayer),
    // A viewer left open outlives its credentials; rotation goes through the
    // shared provider, so every fabriks store re-credentials on ONE mutation.
    refreshConfig: async (options) =>
      buildS3FetchConfig(
        await getGeneralAccess(client, { ...options, kind: "fabriks" }),
        descriptor,
        datalayer,
      ),
  });

  const mirrored = mirroredManifest(node);
  if (mirrored) return FabriksCollection.fromMirroredManifest(mirrored, store);

  console.warn(
    `[fabriks] store ${node.id} mirrors no manifest; reading fabriks.json from the prefix instead.`,
  );
  return FabriksCollection.open(store);
}

/**
 * The manifest as the API mirrors it, or null when the server did not.
 *
 * The mirrored fields are `fabriks.json` verbatim, field for field, so they are
 * reassembled rather than converted. `files` is the load-bearing one — without
 * it there is nothing to read — so its absence alone sends us to the prefix.
 */
function mirroredManifest(node: FabriksStoreFragment): Record<string, unknown> | null {
  if (!node.specVersion || !node.grid || !node.encoding || !node.files) return null;
  return {
    specVersion: node.specVersion,
    grid: node.grid,
    encoding: node.encoding,
    counts: node.counts ?? {},
    files: node.files,
  };
}

/**
 * The collection's axis names in VERTEX COMPONENT order, or null if unstated.
 *
 * fabriks addresses components by position — `cellSize[0]`, `bbox_*_x` — and
 * says nothing about which physical axis a slot is, so a collection cut from
 * (z, y, x) data is entirely consistent and would render transposed if the
 * renderer assumed otherwise. This is the store telling us the mapping, and it
 * is the only trustworthy source for it.
 */
export const fabriksAxisOrder = (node: FabriksStoreFragment): string[] | null =>
  node.axes && node.axes.length > 0 ? [...node.axes] : null;
