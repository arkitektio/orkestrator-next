import { getChunkWorker } from "../../../../lib/zarr/runner";
import { workerPool } from "../../../workers/pool";
import { open } from "zarrita";
import type { OpenedZarrArray } from "../data/arrayRegistry";
import { requestGeneralAccess } from "../data/sceneStores";
import { ConfiguredS3Store } from "../zarr/zarr_stores/s3Store";
import type { MikroClient } from "../zarr/zarr_stores/type";
import type { LayerState } from "../core/layerModel";
import type { BrickResidencyManager } from "./brickResidency";
import type { AttributePlanLike, ZarrStoreLike } from "../core/attributes/attributeTypes";
import type { SampleSource } from "../core/attributes/sampleSource";
import { readTypedValue } from "../core/attributes/sampleSource";

/**
 * Concrete `SampleSource`s for attribute plans.
 *
 * The EXACT path is one shared implementation: read the plan's array through
 * the zarr worker pipeline (decoded-chunk LRU + in-flight dedupe, the same
 * cache the renderer fills), indexing every axis explicitly from the plan's
 * coordinates — no dependence on any layer's collapsed-dim state. The array
 * itself is either a scene store the viewer already opened (hovering a
 * rendered mask costs no new credentials) or a foreign store opened once per
 * scene through a general zarr grant.
 *
 * The RESIDENT fast path is an optimistic sync pre-read from the brick
 * atlas's CPU mirror, only bound when it is provably reading the same slice:
 * the plan must be locally rooted (empty path — its non-spatial coordinates
 * then come from the SAME scene-wide `dimSelections` the layer's pool
 * collapsed on) and the plan's array must be some rendered layer's level-0
 * store. Coarser-LOD reads can misattribute a label at object boundaries,
 * which is why every resident value is upgraded by the exact read.
 */

export type SampleSourceContext = {
  /** `viewerStore.getState().getArrayForStoreId` — throws for unknown stores. */
  getArrayForStoreId: (storeId: string) => OpenedZarrArray;
  getBrickSystem: () => BrickResidencyManager | null;
  getLayers: () => readonly LayerState[];
  client: MikroClient;
  datalayer: string;
};

type ResidentBinding = {
  layerId: string;
  /** Positions of the render axes in the sample system's axis order. */
  xPos: number;
  yPos: number;
  zPos: number;
};

const level0Of = (layer: LayerState) =>
  layer.lens.dataset.dataArrays.reduce<
    LayerState["lens"]["dataset"]["dataArrays"][number] | null
  >((best, da) => (best === null || da.level < best.level ? da : best), null);

const findResidentBinding = (
  layers: readonly LayerState[],
  plan: AttributePlanLike,
): ResidentBinding | null => {
  for (const layer of layers) {
    const level0 = level0Of(layer);
    if (!level0 || level0.store.id !== plan.sample.store.id) continue;
    const axisNames = [...plan.sample.system.axes]
      .sort((a, b) => a.order - b.order)
      .map((axis) => axis.name);
    const ra = layer.lens.renderAxes;
    const xPos = axisNames.indexOf(ra.x);
    const yPos = axisNames.indexOf(ra.y);
    if (xPos === -1 || yPos === -1) return null;
    return {
      layerId: layer.id,
      xPos,
      yPos,
      zPos: ra.z ? axisNames.indexOf(ra.z) : -1,
    };
  }
  return null;
};

export function createSampleSourceFactory(ctx: SampleSourceContext) {
  /** Foreign (non-scene) arrays, opened once per store for the scene's life. */
  const foreignArrays = new Map<string, Promise<OpenedZarrArray>>();

  const openForeignArray = (store: ZarrStoreLike): Promise<OpenedZarrArray> => {
    let opened = foreignArrays.get(store.id);
    if (!opened) {
      opened = (async () => {
        const credentials = await requestGeneralAccess(ctx.client);
        const s3Store = new ConfiguredS3Store(
          {
            accessKey: credentials.accessKey,
            baseUrl: `${ctx.datalayer.replace(/\/$/, "")}/${credentials.bucket}/${store.key}`,
            expiresAt: Date.now() + credentials.expiresIn * 1000,
            region: credentials.region,
            secretKey: credentials.secretKey,
            sessionToken: credentials.sessionToken,
            storeId: store.id,
          },
          { preloadMetadata: true },
        );
        await s3Store.ready();
        return (await open.v3(s3Store, { kind: "array" })) as OpenedZarrArray;
      })().catch((error) => {
        foreignArrays.delete(store.id); // allow retry after transient failures
        throw error;
      });
      foreignArrays.set(store.id, opened);
    }
    return opened;
  };

  const getArray = (store: ZarrStoreLike): Promise<OpenedZarrArray> => {
    try {
      return Promise.resolve(ctx.getArrayForStoreId(store.id));
    } catch {
      return openForeignArray(store);
    }
  };

  const readExact = async (
    store: ZarrStoreLike,
    index: readonly number[],
  ): Promise<number | bigint | null> => {
    const arr = await getArray(store);
    if (index.length !== arr.shape.length) return null;
    const chunkShape = arr.chunks;
    const chunkCoords = index.map((v, d) => Math.floor(v / chunkShape[d]));
    const chunk = await getChunkWorker(arr, chunkCoords, {
      pool: workerPool,
      priority: 0,
      useSharedArrayBuffer: true,
    });
    const flat = index.reduce(
      (acc, v, d) => acc + (v - chunkCoords[d] * chunkShape[d]) * (chunk.stride[d] ?? 0),
      0,
    );
    return readTypedValue(chunk.data as ArrayLike<number> | ArrayLike<bigint>, flat);
  };

  return (plan: AttributePlanLike): SampleSource => {
    const resident =
      plan.path.length === 0 ? findResidentBinding(ctx.getLayers(), plan) : null;
    return {
      sampleSync(index) {
        if (!resident) return null;
        const brickSystem = ctx.getBrickSystem();
        if (!brickSystem) return null;
        return brickSystem.sampleResident(
          resident.layerId,
          [
            index[resident.xPos] ?? 0,
            index[resident.yPos] ?? 0,
            resident.zPos !== -1 ? index[resident.zPos] ?? 0 : 0,
          ],
          0,
          0,
        );
      },
      sampleExact(index) {
        return readExact(plan.sample.store, index).catch(() => null);
      },
    };
  };
}

export type SampleSourceFactory = ReturnType<typeof createSampleSourceFactory>;
