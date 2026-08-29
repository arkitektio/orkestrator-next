import { useCallback } from "react";
import { useDeleteAnnotationMutation } from "@/mikro-next/api/graphql";
import { useRoiSelectionStore } from "./roiSelectionStore";

/**
 * Delete every selected annotation, one mutation each, dropping only the
 * fulfilled ones from the selection — a partial failure leaves the failed
 * ROIs selected so the user can retry. Shared by the annotations panel's
 * Delete button and the Backspace keybinding (`RoiDeleteKeybinding`).
 */
export const useDeleteSelectedRois = (): {
  deleteSelectedRois: () => Promise<void>;
  isDeleting: boolean;
} => {
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const removeSelectedRoi = useRoiSelectionStore((s) => s.removeSelectedRoi);
  const [deleteAnnotationMutation, { loading: isDeleting }] = useDeleteAnnotationMutation({
    refetchQueries: ["GetSceneAnnotations"],
    awaitRefetchQueries: false,
  });

  const deleteSelectedRois = useCallback(async () => {
    if (selectedRois.length === 0 || isDeleting) return;

    const roisToDelete = [...selectedRois];

    const results = await Promise.allSettled(
      roisToDelete.map(async (roi) => {
        await deleteAnnotationMutation({
          variables: { input: { id: roi.id } },
        });

        return roi.id;
      }),
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        removeSelectedRoi(result.value);
      }
    });
  }, [deleteAnnotationMutation, isDeleting, removeSelectedRoi, selectedRois]);

  return { deleteSelectedRois, isDeleting };
};
