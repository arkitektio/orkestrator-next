import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Crosshair, Save, X } from "lucide-react";
import { useState } from "react";
import { ImageLayerFragment } from "../../core/layerGuards";
import { LayerState } from "../../store/sceneStore";
import { isLayerDirty } from "./colormap-utils";
import { DimPill } from "./DimPill";
import {
  RenderGraphEditor,
  RenderGraphSection,
} from "./rendergraph/RenderNodeEditor";

/**
 * The editing surface for a single layer, shown as a flyout to the left of the
 * Layers panel. Holds the render graph (channels, contrast, colormap,
 * projection — the single rendering truth) and an Advanced section for
 * dimension mapping and level-of-detail.
 */
export const LayerGraphFlyout = ({
  layer,
  originalLayer,
  isArmed,
  editor,
  onUpdate,
  onToggleArm,
  onSave,
  onClose,
  inline = false,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  /** Lifted render-graph editing state (shared with the card header's Save). */
  editor: RenderGraphEditor;
  onUpdate: (updated: LayerState) => void;
  onToggleArm: () => void;
  onSave: (layer: LayerState) => void;
  onClose: () => void;
  /**
   * When true, render only the editing body (no floating panel chrome or
   * header) so the parent LayerRow can expand in place to reveal it, instead
   * of popping a separate window.
   */
  inline?: boolean;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const dirty = isLayerDirty(layer, originalLayer);

  const label =
    layer.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel
      ?.label ?? "Untitled Layer";

  const dims: { label: string; key: keyof ImageLayerFragment }[] = [
    { label: "X", key: "xDim" },
    { label: "Y", key: "yDim" },
    { label: "Z", key: "zDim" },
    { label: "I", key: "intensityDim" },
  ];

  const swapDims = (
    keyA: keyof ImageLayerFragment,
    keyB: keyof ImageLayerFragment,
  ) => {
    onUpdate({
      ...layer,
      [keyA]: layer[keyB],
      [keyB]: layer[keyA],
    } as LayerState);
  };

  const body = (
    <div
      className={
        inline
          ? "flex flex-col overflow-y-auto px-2 py-2 text-[10px] text-white/85"
          : "flex flex-col overflow-y-auto px-3 py-2 text-[10px] text-white/85"
      }
    >
      <RenderGraphSection editor={editor} layer={layer} />

        {dirty && (
          <Button
            variant="outline"
            size="xs"
            className="h-7 border-white/10 bg-black/20 text-[10px] text-white hover:bg-white/10"
            onClick={() => onSave(layer)}
          >
            <Save className="mr-1 h-3 w-3" />
            Save changes
          </Button>
        )}


      </div>
  );

  // Inline mode: just the editing body, so the LayerRow can expand to reveal it.
  if (inline) return body;

  return (
    <div className="flex w-72 max-h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white/90">
          {label}
        </span>
        <Button
          variant="ghost"
          size="xs"
          className={`h-6 w-6 p-0 ${
            isArmed ? "text-cyan-200" : "text-white/60 hover:text-white"
          }`}
          title={isArmed ? "Disarm ROI constraints" : "Arm for ROI constraints"}
          onClick={onToggleArm}
        >
          <Crosshair className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-white/60 hover:text-white"
          title="Close"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {body}
    </div>
  );
};
