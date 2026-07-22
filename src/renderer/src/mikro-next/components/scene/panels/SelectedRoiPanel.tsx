import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeleteAnnotationMutation } from "@/mikro-next/api/graphql";
import { useRoiSelectionStore } from "../store/roiSelectionStore";

function formatRoiKind(kind: string) {
  return kind.charAt(0) + kind.slice(1).toLowerCase();
}

// No detail link: `/mikro/rois/:id` is the LEGACY image-anchored `ROI` page
// (`roi(id:)`), a different table with a different id space — these are
// `Annotation` UUIDs. Restore a link here once annotations have a page of
// their own.
export const SelectedRoiPanel = () => {
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const removeSelectedRoi = useRoiSelectionStore((s) => s.removeSelectedRoi);
  const clearSelectedRois = useRoiSelectionStore((s) => s.clearSelectedRois);
  const [deleteAnnotationMutation, { loading: isDeleting }] = useDeleteAnnotationMutation({
    refetchQueries: ["GetAnnotations"],
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

  useEffect(() => {
    if (selectedRois.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Backspace") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();
      void deleteSelectedRois();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedRois, selectedRois.length]);

  if (selectedRois.length === 0) return null;

  return (
    <Card className="absolute right-4 top-20 z-30 w-80 max-h-[60vh] overflow-y-auto border-white/10 bg-black/85 p-3 text-white shadow-xl backdrop-blur-md pointer-events-auto">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
            Selected ROIs
          </div>
          <div className="text-xs text-white/70">
            {selectedRois.length} selected. Shift+click adds or removes ROIs.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void deleteSelectedRois()}
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
          <Button size="xs" variant="outline" onClick={() => clearSelectedRois()}>
          Clear
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {selectedRois.map((roi) => (
          <div key={roi.id} className="rounded-md border border-white/10 bg-white/5 p-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white/90">
                  {roi.name || `ROI ${roi.id}`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/45">
                  {formatRoiKind(roi.kind)} · Layer {roi.layerId}
                </div>
                <div className="mt-1 truncate rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-white/65">
                  {roi.id}
                </div>
              </div>
              <Button
                size="xs"
                variant="ghost"
                className="text-white/60 hover:text-white"
                disabled={isDeleting}
                onClick={() => removeSelectedRoi(roi.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
