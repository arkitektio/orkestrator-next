import {
  MikroClient,
  SceneZarrStoreDescriptor,
  ZarrStore,
} from "@/lib/zarr/store/types";
import { ConfiguredS3Store } from "@/lib/zarr/store/s3Store";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { isImageLayer } from "../core/layerGuards";
import { requestGeneralAccess } from "@/mikro-next/lib/zarr/access";

export { requestGeneralAccess } from "@/mikro-next/lib/zarr/access";

/**
 * Zarr store construction for a scene: gather the unique data-array stores an
 * image scene references, request S3 credentials, and build a ready
 * `ConfiguredS3Store` per store. Extracted out of `store/viewerStore.ts` so the
 * store no longer owns data-loading — it just consumes these.
 */
export function collectSceneStoreDescriptors(scene: SceneFragment): Map<string, SceneZarrStoreDescriptor> {
  const descriptors = new Map<string, SceneZarrStoreDescriptor>();

  for (const layer of scene.layers) {
    if (!isImageLayer(layer)) continue;
    for (const dataArray of layer.lens.dataset.dataArrays) {
      descriptors.set(dataArray.store.id, {
        bucket: dataArray.store.bucket,
        key: dataArray.store.key,
        path: dataArray.store.path,
        storeId: dataArray.store.id,
      });
    }
  }

  return descriptors;
}

export async function createConfiguredSceneStores(
  scene: SceneFragment,
  client: MikroClient,
  datalayer: string,
): Promise<Map<string, ZarrStore>> {
  const descriptors = collectSceneStoreDescriptors(scene);
  const credentials = await requestGeneralAccess(client);
  const expiresAt = Date.now() + credentials.expiresIn * 1000; //TODO: make that set corctly in credentials

  const stores = await Promise.all(
    Array.from(descriptors.values()).map(async (descriptor) => {
      const store = new ConfiguredS3Store(
        {
          accessKey: credentials.accessKey,
          baseUrl: `${datalayer.replace(/\/$/, "")}/${credentials.bucket}/${descriptor.key}`,
          expiresAt,
          region: credentials.region,
          secretKey: credentials.secretKey,
          sessionToken: credentials.sessionToken,
          storeId: descriptor.storeId,
        },
        { preloadMetadata: true },
      );
      await store.ready();
      return [descriptor.storeId, store] as const;
    }),
  );

  return new Map(stores);
}
