import { useCallback, useMemo } from "react";
import {
  RoiKind,
  useCreateAnnotationMutation,
  type CreateAnnotationMutation,
} from "@/mikro-next/api/graphql";
import { useRoiSelectionStoreApi } from "../store/roiSelectionStore";
import { useSceneStore, useSceneStoreApi } from "../store/sceneStore";

export type CreatedSceneAnnotation = CreateAnnotationMutation["createAnnotation"];

/**
 * The one path that persists an annotation into the scene, shared by the
 * shape drawer (`RoiDrawer`), the probe's shift+click save (brick layers) and
 * the probe panel. Vectors are scene WORLD coordinates verbatim — the scene's
 * annotation collection is registered into the world by identity, so there is
 * no world→voxel inversion.
 *
 * A confirmed annotation is auto-selected (single selection), so the selected
 * ROI panel starts its attribute lookups the moment the server answers.
 */
export const useCreateSceneAnnotation = () => {
  const sceneId = useSceneStore((s) => s.id);
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const sceneStoreApi = useSceneStoreApi();
  const roiSelectionApi = useRoiSelectionStoreApi();
  const [createAnnotation] = useCreateAnnotationMutation();

  // Annotating the scene mints its annotation collection, the collection's
  // registration into the world AND the AnnotationLayer that draws it — but
  // only on first use. Until that layer exists there is nothing to render the
  // shape, so the first annotation has to refetch the scene itself; later ones
  // only need the layer's own annotation query.
  const hasAnnotationLayer = useMemo(
    () => sceneLayers.some((layer) => layer.__typename === "AnnotationLayer"),
    [sceneLayers],
  );

  const createSceneAnnotation = useCallback(
    async (
      kind: RoiKind,
      worldVectors: [number, number, number][],
    ): Promise<CreatedSceneAnnotation | null> => {
      try {
        const result = await createAnnotation({
          variables: { input: { scene: sceneId, kind, vectors: worldVectors } },
          refetchQueries: hasAnnotationLayer ? ["GetAnnotations"] : ["GetScene"],
          awaitRefetchQueries: false,
        });
        const created = result.data?.createAnnotation ?? null;
        if (!created) return null;

        // Auto-select the confirmed annotation. On the very first annotation
        // the AnnotationLayer does not exist yet (GetScene refetch in flight)
        // — layerId stays "" and the highlight catches up by annotation id
        // once the layer mounts; the attribute lookups only need the system
        // and vectors from the payload.
        const annotationLayer = sceneStoreApi
          .getState()
          .sceneLayers.find(
            (layer) =>
              layer.__typename === "AnnotationLayer" &&
              layer.annotationCollection?.id === created.collection.id,
          );
        const system =
          created.coordinateSystem ??
          (annotationLayer?.__typename === "AnnotationLayer"
            ? annotationLayer.annotationCollection?.coordinateSystem
            : null) ??
          null;
        roiSelectionApi.getState().selectOnlyRoi({
          id: created.id,
          layerId: annotationLayer?.id ?? "",
          name: created.name,
          kind: created.kind,
          systemId: system?.id ?? null,
          axisNames: (system?.axes ?? []).map((axis) => axis.name),
          vectors: created.vectors ?? [],
          coordinates: created.coordinates ?? [],
        });
        return created;
      } catch (err) {
        console.error("Failed to create annotation:", err);
        return null;
      }
    },
    [createAnnotation, hasAnnotationLayer, sceneId, sceneStoreApi, roiSelectionApi],
  );

  const createPointAnnotation = useCallback(
    (worldPos: [number, number, number]) =>
      createSceneAnnotation(RoiKind.Point, [worldPos]),
    [createSceneAnnotation],
  );

  return { createSceneAnnotation, createPointAnnotation };
};
