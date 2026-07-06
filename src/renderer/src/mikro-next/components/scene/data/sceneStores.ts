import {
  GeneralZarrAccessGrant,
  MikroClient,
  SceneZarrStoreDescriptor,
  ZarrStore,
} from "../zarr/zarr_stores/type";
import { ConfiguredS3Store } from "../zarr/zarr_stores/s3Store";
import { RequestGeneralZarrAccessDocument, RequestGeneralZarrAccessMutation, SceneFragment } from "@/mikro-next/api/graphql";
import { isImageLayer } from "../core/layerGuards";

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

export async function requestGeneralAccess(client: MikroClient): Promise<GeneralZarrAccessGrant> {
  const access = (await client.mutate({
    mutation: RequestGeneralZarrAccessDocument,
    variables: { input: {} },
  })) as { data?: RequestGeneralZarrAccessMutation };

  const credentials = access.data?.requestGeneralZarrAccess;
  if (!credentials) {
    throw new Error("Failed to obtain general Zarr access credentials");
  }

  return credentials;
}

export async function createConfiguredSceneStores(
  scene: SceneFragment,
  client: MikroClient,
  datalayer: string,
): Promise<Map<string, ZarrStore>> {
  const descriptors = collectSceneStoreDescriptors(scene);
  const credentials = await requestGeneralAccess(client);
  const expiresAt = Date.now() + credentials.expiresIn * 1000;

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
