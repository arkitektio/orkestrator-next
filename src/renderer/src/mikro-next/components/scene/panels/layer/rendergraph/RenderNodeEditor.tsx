import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RgbColorPicker } from "react-colorful";
import {
  Blending,
  ColorMap,
  ProjectionMode,
  useUpdateLaterMutation,
} from "@/mikro-next/api/graphql";
import {
  Blend,
  Box,
  ChevronRight,
  Layers,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { COLORMAP_OPTIONS, colormapGradientCSS } from "../colormap-utils";
import { HistogramSlider } from "../HistogramSlider";
import {
  absoluteToNormalized,
  getLayerDtypeRange,
  normalizedToAbsolute,
} from "../contrast-utils";
import { LayerState, useSceneStore } from "../../../store/sceneStore";
import {
  BLEND_KIND,
  BlendRenderNode,
  CHANNEL_KIND,
  ChannelRenderNode,
  PROJECTION_KIND,
  ProjectionRenderNode,
  RenderNode,
  TransferFn,
  flattenChannels,
  primaryChannelRenderFields,
  resolveLayerGraph,
  resolveProjectionMode,
  serializeRenderGraph,
} from "../../../core/renderGraph";

const newChannel = (): ChannelRenderNode => ({
  type: "channel",
  kind: CHANNEL_KIND,
  label: null,
  intensityDim: null,
  intensityIndex: 0,
  visible: true,
  transfer: {
    climMin: 0,
    climMax: 1,
    colormap: ColorMap.Viridis,
    color: null,
    gamma: null,
    opacity: null,
    invert: null,
    categorical: null,
  },
});

const newBlend = (): BlendRenderNode => ({
  type: "blend",
  kind: BLEND_KIND,
  label: null,
  blending: Blending.Additive,
  children: [],
});

const newProjection = (): ProjectionRenderNode => ({
  type: "projection",
  kind: PROJECTION_KIND,
  label: null,
  mode: ProjectionMode.Mip,
  children: [],
});

const colorToObj = (color: number[] | null) => ({
  r: Math.round(color?.[0] ?? 255),
  g: Math.round(color?.[1] ?? 255),
  b: Math.round(color?.[2] ?? 255),
});

/**
 * Histogram-backed contrast editor for a channel's transfer. Transfer clims
 * are normalized [0,1]; the slider works in absolute data values, converted
 * via the layer's dtype range. Histogram data comes from the layer's active
 * anchor (first anchor carrying a value histogram).
 */
const TransferHistogram = ({
  layer,
  transfer,
  onClimChange,
}: {
  layer: LayerState;
  transfer: TransferFn;
  onClimChange: (climMin: number, climMax: number) => void;
}) => {
  const [dtypeMin, dtypeMax] = getLayerDtypeRange(layer);
  const anchor = layer.lens.activeAnchors.find((a) => a.valueHistogram);
  const vh = anchor?.valueHistogram;

  return (
    <HistogramSlider
      bins={vh?.bins ?? []}
      histogram={vh?.histogram ?? []}
      valueMin={normalizedToAbsolute(transfer.climMin ?? 0, dtypeMin, dtypeMax)}
      valueMax={normalizedToAbsolute(transfer.climMax ?? 1, dtypeMin, dtypeMax)}
      colormap={transfer.colormap}
      baseColor={transfer.color}
      p1={vh?.p1 ?? null}
      p99={vh?.p99 ?? null}
      histMin={vh?.min ?? dtypeMin}
      histMax={vh?.max ?? dtypeMax}
      dtypeMin={dtypeMin}
      dtypeMax={dtypeMax}
      onChange={(nextMin, nextMax) =>
        onClimChange(
          absoluteToNormalized(nextMin, dtypeMin, dtypeMax),
          absoluteToNormalized(nextMax, dtypeMin, dtypeMax),
        )
      }
    />
  );
};

const TransferEditor = ({
  transfer,
  onChange,
  layer,
}: {
  transfer: TransferFn;
  onChange: (t: TransferFn) => void;
  layer?: LayerState;
}) => {
  const set = (patch: Partial<TransferFn>) => onChange({ ...transfer, ...patch });
  return (
    <div className="flex flex-col gap-2 pl-1">
      {layer ? (
        <TransferHistogram
          layer={layer}
          transfer={transfer}
          onClimChange={(climMin, climMax) => set({ climMin, climMax })}
        />
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-muted-foreground">Clim min</span>
            <Input
              type="number"
              className="h-7 text-xs"
              value={transfer.climMin ?? 0}
              step={0.01}
              onChange={(e) => set({ climMin: e.target.value === "" ? null : Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-muted-foreground">Clim max</span>
            <Input
              type="number"
              className="h-7 text-xs"
              value={transfer.climMax ?? 1}
              step={0.01}
              onChange={(e) => set({ climMax: e.target.value === "" ? null : Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">Colormap</span>
        <Select
          value={transfer.colormap ?? ColorMap.Viridis}
          onValueChange={(v) => set({ colormap: v as ColorMap })}
        >
          <SelectTrigger className="h-7 text-xs">
            <div
              className="h-3 w-full rounded"
              style={{ background: colormapGradientCSS(transfer.colormap ?? ColorMap.Viridis, 18, transfer.color) }}
            />
          </SelectTrigger>
          <SelectContent>
            {COLORMAP_OPTIONS.map((cm) => (
              <SelectItem key={cm} value={cm} className="text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-10 rounded"
                    style={{ background: colormapGradientCSS(cm, 18, transfer.color) }}
                  />
                  {cm.charAt(0) + cm.slice(1).toLowerCase()}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Gamma</span>
          <span className="font-mono">{(transfer.gamma ?? 1).toFixed(2)}</span>
        </div>
        <Slider
          min={0.1}
          max={3}
          step={0.05}
          value={[transfer.gamma ?? 1]}
          onValueChange={([g]) => set({ gamma: g })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Opacity</span>
          <span className="font-mono">{(transfer.opacity ?? 1).toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[transfer.opacity ?? 1]}
          onValueChange={([o]) => set({ opacity: o })}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Invert</span>
        <Switch checked={!!transfer.invert} onCheckedChange={(v) => set({ invert: v })} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Categorical</span>
        <Switch checked={!!transfer.categorical} onCheckedChange={(v) => set({ categorical: v })} />
      </div>

      <Collapsible>
        <CollapsibleTrigger className="text-muted-foreground text-left hover:text-foreground">
          Base color
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <RgbColorPicker
            color={colorToObj(transfer.color)}
            onChange={(c) => set({ color: [c.r, c.g, c.b] })}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const ChannelNodeEditor = ({
  node,
  onChange,
  onRemove,
  layer,
}: {
  node: ChannelRenderNode;
  onChange: (n: ChannelRenderNode) => void;
  onRemove?: () => void;
  layer?: LayerState;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded border border-border/60 bg-background/40 p-2">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex items-center gap-1 flex-1 text-left">
            <ChevronRight
              className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
            />
            <Layers className="h-3 w-3" />
            <span className="font-medium">
              {node.label || `Channel ${node.intensityIndex}`}
            </span>
          </CollapsibleTrigger>
          <Switch
            checked={node.visible}
            onCheckedChange={(v) => onChange({ ...node, visible: v })}
          />
          {onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CollapsibleContent className="pt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-muted-foreground">Intensity index</span>
              <Input
                type="number"
                className="h-7 text-xs"
                value={node.intensityIndex}
                onChange={(e) => onChange({ ...node, intensityIndex: Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-muted-foreground">Intensity dim</span>
              <Input
                className="h-7 text-xs"
                value={node.intensityDim ?? ""}
                placeholder="c"
                onChange={(e) =>
                  onChange({ ...node, intensityDim: e.target.value || null })
                }
              />
            </div>
          </div>
          <TransferEditor
            transfer={node.transfer}
            onChange={(transfer) => onChange({ ...node, transfer })}
            layer={layer}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const AddChildButtons = ({ onAdd }: { onAdd: (n: RenderNode) => void }) => (
  <div className="flex items-center gap-1">
    <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => onAdd(newChannel())}>
      <Plus className="h-3 w-3 mr-1" /> Channel
    </Button>
    <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => onAdd(newBlend())}>
      <Plus className="h-3 w-3 mr-1" /> Blend
    </Button>
    <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => onAdd(newProjection())}>
      <Plus className="h-3 w-3 mr-1" /> Projection
    </Button>
  </div>
);

const ContainerNodeEditor = ({
  node,
  onChange,
  onRemove,
  isRoot,
  layer,
}: {
  node: BlendRenderNode | ProjectionRenderNode;
  onChange: (n: BlendRenderNode | ProjectionRenderNode) => void;
  onRemove?: () => void;
  isRoot?: boolean;
  layer?: LayerState;
}) => {
  const [open, setOpen] = useState(true);
  const setChild = (index: number, child: RenderNode | null) => {
    const children = child
      ? node.children.map((c, i) => (i === index ? child : c))
      : node.children.filter((_, i) => i !== index);
    onChange({ ...node, children });
  };
  const addChild = (child: RenderNode) => onChange({ ...node, children: [...node.children, child] });

  return (
    <div className={isRoot ? "" : "rounded border border-border/60 bg-background/40 p-2"}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex items-center gap-1 flex-1 text-left">
            <ChevronRight
              className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
            />
            {node.type === "blend" ? <Blend className="h-3 w-3" /> : <Box className="h-3 w-3" />}
            <span className="font-medium capitalize">{node.label || node.type}</span>
          </CollapsibleTrigger>
          {node.type === "blend" ? (
            <Select
              value={node.blending}
              onValueChange={(v) => onChange({ ...node, blending: v as Blending })}
            >
              <SelectTrigger className="h-6 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Blending).map((b) => (
                  <SelectItem key={b} value={b} className="text-xs">
                    {b.charAt(0) + b.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={node.mode}
              onValueChange={(v) => onChange({ ...node, mode: v as ProjectionMode })}
            >
              <SelectTrigger className="h-6 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProjectionMode).map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CollapsibleContent className="pt-2 flex flex-col gap-2 pl-3 border-l border-border/50 ml-1">
          {node.children.map((child, i) => (
            <RenderNodeEditor
              key={i}
              node={child}
              onChange={(c) => setChild(i, c)}
              onRemove={() => setChild(i, null)}
              layer={layer}
            />
          ))}
          <AddChildButtons onAdd={addChild} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export const RenderNodeEditor = ({
  node,
  onChange,
  onRemove,
  layer,
}: {
  node: RenderNode;
  onChange: (n: RenderNode) => void;
  onRemove?: () => void;
  layer?: LayerState;
}) => {
  if (node.type === "channel") {
    return <ChannelNodeEditor node={node} onChange={onChange} onRemove={onRemove} layer={layer} />;
  }
  return (
    <ContainerNodeEditor
      node={node}
      onChange={onChange}
      onRemove={onRemove}
      layer={layer}
    />
  );
};

/**
 * The render-node "aspect" for an image layer: view/edit the layer's
 * `renderGraph` (channel sources, transfer functions, blend & projection nodes)
 * and persist it via `updateLayer`.
 */
export const RenderGraphSection = ({ layer }: { layer: LayerState }) => {
  const initial = useMemo(
    () => resolveLayerGraph(layer),
    // Re-seed when the layer identity or its persisted graph changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layer.id, layer.renderGraph],
  );
  const [root, setRoot] = useState<BlendRenderNode>(initial);
  const [dirty, setDirty] = useState(false);
  const [updateLater, { loading }] = useUpdateLaterMutation();
  const updateStoreLayer = useSceneStore((s) => s.updateLayer);

  // The render graph is the single rendering truth. Every edit is pushed to
  // the scene store immediately (live preview); the flat climMin/colormap/…
  // fields are DERIVED from the primary channel here — they exist only for
  // the single-channel 3D shader path and display chrome, and are never
  // written directly by any panel.
  const pushPreview = (nextRoot: BlendRenderNode) => {
    const channels = flattenChannels(nextRoot);
    const primary = channels[0]?.transfer;
    updateStoreLayer({
      ...layer,
      channels,
      blend: nextRoot.blending,
      projection: resolveProjectionMode(nextRoot),
      climMin: primary?.climMin ?? layer.climMin,
      climMax: primary?.climMax ?? layer.climMax,
      colormap: primary?.colormap ?? layer.colormap,
      color: primary?.color ?? layer.color,
      gamma: primary?.gamma ?? layer.gamma,
      intensityDim: channels[0]?.intensityDim ?? layer.intensityDim,
    });
  };

  const change = (n: BlendRenderNode | ProjectionRenderNode) => {
    // The root is always a blend node.
    const nextRoot = n.type === "blend" ? n : { ...root, children: n.children };
    setRoot(nextRoot);
    setDirty(true);
    pushPreview(nextRoot);
  };

  const reset = () => {
    setRoot(initial);
    setDirty(false);
    pushPreview(initial);
  };

  const save = async () => {
    const result = await updateLater({
      variables: { input: { id: layer.id, renderGraph: serializeRenderGraph(root) } },
    });
    const nextGraph = result.data?.updateLayer?.renderGraph ?? layer.renderGraph;
    // Reflect the saved graph's primary channel in the (single-channel) viewer.
    const primary = primaryChannelRenderFields(nextGraph);
    updateStoreLayer({
      ...layer,
      renderGraph: nextGraph,
      channels: flattenChannels(root),
      blend: root.blending,
      projection: resolveProjectionMode(root),
      climMin: primary?.climMin ?? layer.climMin,
      climMax: primary?.climMax ?? layer.climMax,
      colormap: primary?.colormap ?? layer.colormap,
      color: primary?.color ?? layer.color,
      gamma: primary?.gamma ?? layer.gamma,
      intensityDim: primary?.intensityDim ?? layer.intensityDim,
    });
    setDirty(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <ContainerNodeEditor node={root} onChange={change} isRoot layer={layer} />
      {dirty && (
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-7 text-xs" onClick={save} disabled={loading}>
            <Save className="h-3 w-3 mr-1" /> Save render graph
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={reset}>
            <RotateCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
        </div>
      )}
    </div>
  );
};
