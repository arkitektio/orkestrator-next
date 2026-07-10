import { useEffect, useMemo, useState } from "react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  Trash2,
} from "lucide-react";
import { COLORMAP_OPTIONS, colormapGradientCSS } from "../colormap-utils";
import { LevelsEditor } from "../LevelsEditor";
import { getLayerDtypeRange } from "../contrast-utils";
import { LayerState, useSceneStore } from "../../../store/sceneStore";
import {
  BlendRenderNode,
  ChannelRenderNode,
  ProjectionRenderNode,
  RenderNode,
  TransferFn,
  flattenChannels,
  primaryChannelRenderFields,
  resolveLayerGraph,
  resolveProjectionMode,
  serializeRenderGraph,
} from "../../../core/renderGraph";

const colorToObj = (color: number[] | null) => ({
  r: Math.round(color?.[0] ?? 255),
  g: Math.round(color?.[1] ?? 255),
  b: Math.round(color?.[2] ?? 255),
});

const formatColormapName = (cm: ColorMap) =>
  cm.charAt(0) + cm.slice(1).toLowerCase();

/**
 * Compact, searchable colormap picker. A small gradient/name button opens a
 * searchable list in a popover. When the Intensity colormap is active, a
 * separate swatch button exposes the base color in its own popover (never
 * rendered underneath the picker).
 */
const ColormapControl = ({
  transfer,
  onChange,
}: {
  transfer: TransferFn;
  onChange: (t: TransferFn) => void;
}) => {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<TransferFn>) => onChange({ ...transfer, ...patch });
  const current = transfer.colormap ?? ColorMap.Viridis;
  const isIntensity = current === ColorMap.Intensity;
  const rgb = colorToObj(transfer.color);
  return (
    <div className="flex items-center gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-6 min-w-0 flex-1 items-center gap-2 rounded border border-border/60 bg-background/40 px-1.5 text-[10px] transition-colors hover:bg-background/60"
          >
            <div
              className="h-3 w-8 shrink-0 rounded"
              style={{ background: colormapGradientCSS(current, 18, transfer.color) }}
            />
            <span className="truncate">{formatColormapName(current)}</span>
            <ChevronDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-0">
          <Command>
            <CommandInput placeholder="Search colormap…" className="h-8 text-xs" />
            <CommandList>
              <CommandEmpty>No colormap found.</CommandEmpty>
              <CommandGroup>
                {COLORMAP_OPTIONS.map((cm) => (
                  <CommandItem
                    key={cm}
                    value={formatColormapName(cm)}
                    onSelect={() => {
                      set({ colormap: cm });
                      setOpen(false);
                    }}
                    className="gap-2 text-xs"
                  >
                    <div
                      className="h-3 w-8 shrink-0 rounded"
                      style={{ background: colormapGradientCSS(cm, 18, transfer.color) }}
                    />
                    <span className="flex-1 truncate">{formatColormapName(cm)}</span>
                    {cm === current && <Check className="h-3 w-3 shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {isIntensity && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Base color"
              className="h-6 w-6 shrink-0 rounded border border-border/60"
              style={{ background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
            />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-2">
            <RgbColorPicker
              color={rgb}
              onChange={(c) => set({ color: [c.r, c.g, c.b] })}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

/**
 * Levels-style contrast editor for a channel's transfer (black point /
 * gamma midtone / white point over the full-range histogram). Transfer clims
 * are normalized [0,1]; the editor works in absolute data values, converted
 * via the layer's dtype range. Histogram data comes from the layer's active
 * anchor (first anchor carrying a value histogram).
 */
const TransferHistogram = ({
  layer,
  transfer,
  onLevelsChange,
}: {
  layer: LayerState;
  transfer: TransferFn;
  onLevelsChange: (climMin: number, climMax: number, gamma: number) => void;
}) => {
  const [dtypeMin, dtypeMax] = getLayerDtypeRange(layer);
  const anchor = layer.lens.activeAnchors.find((a) => a.valueHistogram);
  const vh = anchor?.valueHistogram;

  // Clim is stored in absolute base-native units, exactly the space the editor
  // works in — so pass it straight through (null = full range).
  return (
    <LevelsEditor
      bins={vh?.bins ?? []}
      histogram={vh?.histogram ?? []}
      value={{
        min: transfer.climMin ?? dtypeMin,
        max: transfer.climMax ?? dtypeMax,
        gamma: transfer.gamma ?? 1,
      }}
      colormap={transfer.colormap}
      baseColor={transfer.color}
      p1={vh?.p1 ?? null}
      p99={vh?.p99 ?? null}
      histMin={vh?.min ?? dtypeMin}
      histMax={vh?.max ?? dtypeMax}
      dtypeMin={dtypeMin}
      dtypeMax={dtypeMax}
      onChange={(next) => onLevelsChange(next.min, next.max, next.gamma)}
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
          onLevelsChange={(climMin, climMax, gamma) => set({ climMin, climMax, gamma })}
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

      <ColormapControl transfer={transfer} onChange={onChange} />

      {/* Gamma lives in the Levels editor (midtone stop) when a histogram is
          available; keep the plain slider only for the layer-less fallback. */}
      {!layer && (
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
      )}

    </div>
  );
};

/**
 * The opacity / invert / categorical knobs — advanced transfer controls kept out
 * of the default histogram-first view. Rendered inside the channel's "Advanced"
 * disclosure alongside the intensity source fields.
 */
const AdvancedTransferControls = ({
  transfer,
  onChange,
}: {
  transfer: TransferFn;
  onChange: (t: TransferFn) => void;
}) => {
  const set = (patch: Partial<TransferFn>) => onChange({ ...transfer, ...patch });
  return (
    <>
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
    </>
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Tint the whole channel card with its colormap ramp (or the intensity
  // base-color ramp) so channels are identifiable at a glance.
  const tint = colormapGradientCSS(
    node.transfer.colormap ?? ColorMap.Viridis,
    18,
    node.transfer.color,
  );
  return (
    <div className="relative overflow-hidden rounded border border-border/10 bg-background/50 p-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28] "
        style={{ background: tint }}
      />
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-1 text-left"
        >
          <ChevronRight
            className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
          />
          <Layers className="h-3 w-3" />
          <span className="font-medium">
            {node.label || `Channel ${node.intensityIndex}`}
          </span>
        </button>
        {onRemove && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      {open && (
        <div className="relative pt-2 flex flex-col gap-2">
          {/* Histogram-first: the levels/colormap editor is the primary control. */}
          <TransferEditor
            transfer={node.transfer}
            onChange={(transfer) => onChange({ ...node, transfer })}
            layer={layer}
          />

          {/* Intensity source + opacity/invert/categorical are advanced knobs,
              hidden by default to keep the histogram the focus. */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1 self-start text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
            />
            Advanced
          </button>
          {showAdvanced && (
            <div className="flex flex-col gap-2 pl-1">
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
              <AdvancedTransferControls
                transfer={node.transfer}
                onChange={(transfer) => onChange({ ...node, transfer })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

  const childEditors = node.children.map((child, i) => (
    <RenderNodeEditor
      key={i}
      node={child}
      onChange={(c) => setChild(i, c)}
      onRemove={() => setChild(i, null)}
      layer={layer}
    />
  ));

  // Root blend: not a collapsible tree. The blend mode is a quiet vertical
  // selector pinned to the far-left spine (clickable, but it doesn't stand out);
  // the channels stack to its right and are always visible.
  if (isRoot && node.type === "blend") {
    return (
      <div className="flex items-stretch gap-2">
        <Select
          value={node.blending}
          onValueChange={(v) => onChange({ ...node, blending: v as Blending })}
        >
          <SelectTrigger
            className="h-full w-4 shrink-0 justify-center gap-0 self-stretch rounded border-0 bg-transparent px-0 py-1 text-[9px] uppercase tracking-widest text-muted-foreground/60 shadow-none transition-colors hover:text-foreground focus:ring-0 [writing-mode:vertical-rl] [&>svg]:hidden"
            title="Blend mode"
          >
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
        <div className="flex min-w-0 flex-1 flex-col">{childEditors}</div>
      </div>
    );
  }

  return (
    <div className={isRoot ? "" : "rounded border border-border/60 bg-background/40"}>
      <div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex flex-1 items-center gap-1 text-left"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
            />
            {node.type === "blend" ? <Blend className="h-3 w-3" /> : <Box className="h-3 w-3" />}
            <span className="font-medium capitalize">{node.label || node.type}</span>
          </button>
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
        {open && (
          <div className="pt-2 flex flex-col gap-2 pl-3 border-l border-border/50 ml-1 bg-black/5">
            {childEditors}
          </div>
        )}
      </div>
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
 * Editing state for a layer's render graph, lifted out of the panel body so the
 * live `root` / `dirty` / `save` can be shared with the collapsed header (which
 * hosts the tiny Save button). Owned by the always-mounted LayerCard, so unsaved
 * edits survive collapsing the card.
 */
export interface RenderGraphEditor {
  root: BlendRenderNode;
  dirty: boolean;
  loading: boolean;
  change: (n: BlendRenderNode | ProjectionRenderNode) => void;
  save: () => Promise<void>;
}

export const useRenderGraphEditor = (layer: LayerState): RenderGraphEditor => {
  const initial = useMemo(
    () => resolveLayerGraph(layer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layer.id, layer.renderGraph],
  );
  const [root, setRoot] = useState<BlendRenderNode>(initial);
  const [dirty, setDirty] = useState(false);
  const [updateLater, { loading }] = useUpdateLaterMutation();
  const updateStoreLayer = useSceneStore((s) => s.updateLayer);

  // Re-seed from the persisted graph when it changes externally and there are no
  // unsaved edits. The editor no longer remounts on expand (it lives in the
  // always-mounted card), so this replaces the old mount-time re-seed.
  useEffect(() => {
    if (!dirty) setRoot(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

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

  return { root, dirty, loading, change, save };
};

/**
 * The render-node "aspect" for an image layer: the editable tree of channel
 * sources, transfer functions, blend & projection nodes. Controlled — the
 * editing state (and the Save action) lives in `useRenderGraphEditor`.
 */
export const RenderGraphSection = ({
  editor,
  layer,
}: {
  editor: RenderGraphEditor;
  layer: LayerState;
}) => (
  <div className="flex flex-col">
    <ContainerNodeEditor node={editor.root} onChange={editor.change} isRoot layer={layer} />
  </div>
);
