import CheckoutMaterializedBlokRenderer from "@/rekuest/components/CheckoutMaterializedBlokRenderer";
import { useEffect, useMemo, useRef, useState } from "react";
import { Matrix4, Vector3 } from "three";
import { useSpaceScene } from "./context";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const DEFAULT_PANEL_SIZE = {
  width: 280,
  height: 180,
};

const MaterializedBlokPanel = ({ panelId, placementId }: { panelId: string; placementId: string }) => {
  const placements = useSpaceScene((s) => s.placements);
  const vpMatrix = useSpaceScene((s) => s.viewProjectionMatrix);
  const viewportSize = useSpaceScene((s) => s.viewportSize);
  const closePanel = useSpaceScene((s) => s.closePanel);
  const selectPlacement = useSpaceScene((s) => s.selectPlacement);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelSize, setPanelSize] = useState(DEFAULT_PANEL_SIZE);

  const placement = placements.find((item) => item.id === placementId);
  const materializedBlokId = placement?.blok?.id;

  useEffect(() => {
    const node = panelRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = Math.ceil(entry.contentRect.width);
      const nextHeight = Math.ceil(entry.contentRect.height);

      setPanelSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [materializedBlokId]);

  const screenPos = useMemo(() => {
    if (!placement || !vpMatrix || viewportSize.width === 0 || viewportSize.height === 0) {
      return null;
    }

    const affine = placement.affineMatrix as number[][] | null | undefined;
    if (!affine || affine.length < 4) {
      return null;
    }

    const matrix = new Matrix4();
    matrix.set(
      affine[0][0],
      affine[0][1],
      affine[0][2],
      affine[0][3],
      affine[1][0],
      affine[1][1],
      affine[1][2],
      affine[1][3],
      affine[2][0],
      affine[2][1],
      affine[2][2],
      affine[2][3],
      affine[3][0],
      affine[3][1],
      affine[3][2],
      affine[3][3],
    );

    const world = new Vector3();
    world.setFromMatrixPosition(matrix);
    world.applyMatrix4(vpMatrix);

    if (world.z < -1 || world.z > 1) {
      return null;
    }

    const panelWidth = panelSize.width;
    const panelHeight = panelSize.height;
    const anchorX = (world.x * 0.5 + 0.5) * viewportSize.width;
    const anchorY = (world.y * -0.5 + 0.5) * viewportSize.height;

    return {
      left: clamp(anchorX + 24, 16, viewportSize.width - panelWidth - 16),
      top: clamp(anchorY - panelHeight / 2, 16, viewportSize.height - panelHeight - 16),
    };
  }, [panelSize.height, panelSize.width, placement, vpMatrix, viewportSize.height, viewportSize.width]);

  if (!placement || !screenPos) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-20 pointer-events-auto"
      style={{
        left: screenPos.left,
        top: screenPos.top,
        maxWidth: Math.max(220, Math.min(560, viewportSize.width - 32)),
        maxHeight: Math.max(120, viewportSize.height - 32),
      }}
    >
      <button
        className="absolute right-3 top-3 z-10 rounded-full border border-border/70 bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow-sm transition hover:text-foreground"
        onClick={() => {
          closePanel(panelId);
          selectPlacement(null);
        }}
        type="button"
      >
        Close
      </button>

      <div className="max-h-full max-w-full">
        <CheckoutMaterializedBlokRenderer
          materializedBlokId={materializedBlokId}
          chrome="minimal"
          sizing="intrinsic"
          surfaceId={materializedBlokId ?? placementId}
          loadingFallback={(
            <div className="flex min-h-24 min-w-56 items-center justify-center rounded-xl border border-border/50 bg-background/90 px-4 py-6 text-sm text-muted-foreground shadow-sm">
              Loading panel preview...
            </div>
          )}
          errorFallback={(
            <div className="flex min-h-24 min-w-56 items-center justify-center rounded-xl border border-destructive/40 bg-background/95 px-4 py-6 text-center text-sm text-destructive shadow-sm">
              Failed to load the materialized blok preview.
            </div>
          )}
          emptyFallback={(
            <div className="flex min-h-24 min-w-56 items-center justify-center rounded-xl border border-border/50 bg-background/90 px-4 py-6 text-center text-sm text-muted-foreground shadow-sm">
              This placement does not have a materialized blok preview yet.
            </div>
          )}
        />
      </div>
    </div>
  );
};

export const MaterializedBlokPanels = () => {
  const openPanels = useSpaceScene((s) => s.openPanels);

  if (openPanels.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {openPanels.map((panel) => (
        <MaterializedBlokPanel
          key={panel.id}
          panelId={panel.id}
          placementId={panel.placementId}
        />
      ))}
    </div>
  );
};
