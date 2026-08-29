import { memo, useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  useUpdateIntensityLayerMutation,
  useUpdatePhasorLayerMutation,
  useUpdateRgbLayerMutation,
} from "@/mikro-next/api/graphql";

import { perfMonitor } from "../../platform/perf/perfMonitor";
import { CardSection, RowLabel } from "../../platform/layerui/cardControls";
import type { LayerState } from "../../platform/stores/sceneStore";
import { useSceneStore } from "../../platform/stores/sceneStore";
import type { ChannelRenderNode, PhasorRenderNode, TransferFn } from "../../platform/model/renderGraph";
import { serializePhasorTransfer } from "../../platform/model/renderGraph";
import {
  PhasorNodeEditor,
  TransferEditor,
} from "../../features/volume/rendergraph/RenderNodeEditor";
import { LayerGraphFlyout } from "./LayerGraphFlyout";
import { LayerRow } from "./LayerRow";
import { UnplannableNotice } from "./UnplannableNotice";
import { CARD_SHELL_CLASSES, type LayerCardProps } from "./cardShell";

/**
 * The card for a FIXED-SHAPE lens layer — `IntensityLayer`, `RgbLayer`,
 * `PhasorLayer`.
 *
 * These have no render graph, so they get no graph editor: the recipe's shape
 * is declared by the type, and only its VALUES are editable. That is a simpler
 * card, not a poorer one — the graph editor's whole vocabulary (add a node,
 * change a blend, reparent) describes choices these types do not offer.
 *
 * The editors themselves are the SAME ones the graph editor mounts
 * (`TransferEditor`, `PhasorNodeEditor`), reused rather than reimplemented — an
 * intensity layer's transfer is the identical `TransferFn`, tint included, and
 * a phasor layer's `phasorRender` normalizes to the identical node. What
 * differs is only where the edit is persisted: each type has its own
 * `update*Layer` mutation, because the generic `updateLayer` takes a
 * `renderGraph` and none of these has one.
 *
 * Live preview is a store write (the renderer reads `sceneStore.layers`); the
 * mutation is the explicit Save, exactly as the graph editor sequences it.
 */
export const FixedShapeLayerCard = memo(function FixedShapeLayerCard({
  layer,
  expanded,
  unplannable,
  onSelect,
  onUpdate,
  onFocus,
  onRemove,
  onClose,
}: LayerCardProps<LayerState>) {
  perfMonitor.countRender("FixedShapeLayerCard"); // no-op unless a perf recording is armed
  const updateStoreLayer = useSceneStore((s) => s.updateLayer);
  const [dirty, setDirty] = useState(false);
  const [saveIntensity, { loading: savingIntensity }] = useUpdateIntensityLayerMutation();
  const [saveRgb, { loading: savingRgb }] = useUpdateRgbLayerMutation();
  const [savePhasor, { loading: savingPhasor }] = useUpdatePhasorLayerMutation();

  const handleSelect = () => onSelect(layer.id, expanded);
  const handleRemove = () => onRemove(layer.id);

  /**
   * Push edited sources into the store AND fold the primary's transfer onto the
   * flat fields, the same contract `useRenderGraphEditor.pushPreview` keeps: the
   * flat fields are DERIVED, never written by a panel on their own.
   */
  const pushChannels = (channels: ChannelRenderNode[]) => {
    const primary = channels[0]?.transfer;
    setDirty(true);
    updateStoreLayer({
      ...layer,
      channels,
      sources: channels,
      climMin: primary?.climMin ?? layer.climMin,
      climMax: primary?.climMax ?? layer.climMax,
      colormap: primary?.colormap ?? layer.colormap,
      color: primary?.color ?? layer.color,
      gamma: primary?.gamma ?? layer.gamma,
      intensityAxis: channels[0]?.intensityAxis ?? layer.intensityAxis,
    });
  };

  const setIntensityTransfer = (transfer: TransferFn) =>
    pushChannels([{ ...layer.channels[0], transfer }]);

  // ONE window for all three planes: an RGB image is three views of one
  // acquisition, so the editor edits the shared window and writes it to each.
  const setRgbTransfer = (transfer: TransferFn) =>
    pushChannels(
      layer.channels.map((channel) => ({
        ...channel,
        transfer: {
          ...channel.transfer,
          climMin: transfer.climMin,
          climMax: transfer.climMax,
        },
      })),
    );

  const setRgbPlane = (slot: number, index: number) =>
    pushChannels(
      layer.channels.map((channel, i) =>
        i === slot ? { ...channel, intensityIndex: index } : channel,
      ),
    );

  const setPhasorNode = (node: PhasorRenderNode) => {
    setDirty(true);
    updateStoreLayer({
      ...layer,
      phasors: [node],
      sources: [node],
      colormap: node.transfer.colormap,
      climMin: node.transfer.intensity.climMin ?? layer.climMin,
      climMax: node.transfer.intensity.climMax ?? layer.climMax,
      gamma: node.transfer.intensity.gamma ?? layer.gamma,
    });
  };

  const save = async () => {
    if (layer.__typename === "IntensityLayer") {
      const transfer = layer.channels[0]?.transfer;
      await saveIntensity({
        variables: {
          input: {
            id: layer.id,
            climMin: transfer?.climMin ?? null,
            climMax: transfer?.climMax ?? null,
            gamma: transfer?.gamma ?? null,
            colormap: transfer?.colormap ?? null,
            // The tint the shared `ColormapControl` edits alongside the ramp —
            // an intensity layer carries it as a field, so it persists here
            // rather than inside a serialized render graph.
            color: transfer?.color ?? null,
            intensityIndex: layer.channels[0]?.intensityIndex ?? null,
          },
        },
      });
    } else if (layer.__typename === "RgbLayer") {
      const [red, green, blue] = layer.channels;
      await saveRgb({
        variables: {
          input: {
            id: layer.id,
            climMin: red?.transfer.climMin ?? null,
            climMax: red?.transfer.climMax ?? null,
            redIndex: red?.intensityIndex ?? null,
            greenIndex: green?.intensityIndex ?? null,
            blueIndex: blue?.intensityIndex ?? null,
          },
        },
      });
    } else {
      const phasor = layer.phasors[0];
      if (!phasor) return;
      await savePhasor({
        variables: {
          input: {
            id: layer.id,
            phasorAxis: phasor.phasorAxis,
            intensityAxis: phasor.intensityAxis,
            intensityIndex: phasor.intensityIndex,
            harmonic: phasor.harmonic,
            transfer: serializePhasorTransfer(phasor.transfer),
          },
        },
      });
    }
    setDirty(false);
  };

  const saving = savingIntensity || savingRgb || savingPhasor;

  return (
    <Collapsible open={expanded} className={CARD_SHELL_CLASSES(expanded)}>
      <LayerRow
        embedded
        layer={layer}
        isSelected={expanded}
        graphDirty={dirty}
        savingGraph={saving}
        onSaveGraph={save}
        onSelect={handleSelect}
        onUpdate={onUpdate}
        onFocus={onFocus}
        onRemove={handleRemove}
      />
      {unplannable && <UnplannableNotice layer={layer} info={unplannable} />}
      {/* Snap open, no height animation — same reason as the image card. */}
      <CollapsibleContent className="overflow-hidden">
        <div className="flex flex-col border-t border-white/10">
          <CardSection title="Rendering">
            {layer.__typename === "IntensityLayer" && layer.channels[0] && (
              <TransferEditor
                layer={layer}
                transfer={layer.channels[0].transfer}
                onChange={setIntensityTransfer}
              />
            )}
            {layer.__typename === "RgbLayer" && layer.channels[0] && (
              <div className="flex flex-col gap-2">
                {/* The tints are fixed basis vectors — what is editable is
                    WHICH plane feeds each of them, and the shared window. */}
                <div className="flex items-center gap-2">
                  {(["Red", "Green", "Blue"] as const).map((name, slot) => (
                    <div key={name} className="flex min-w-0 flex-1 flex-col gap-1">
                      <RowLabel>{name}</RowLabel>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        className="h-7 text-xs"
                        value={layer.channels[slot]?.intensityIndex ?? 0}
                        onChange={(e) => setRgbPlane(slot, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
                {/* Window only: the tints are fixed, so the picker would
                    offer an edit `setRgbTransfer` has nowhere to put. */}
                <TransferEditor
                  layer={layer}
                  showColormap={false}
                  transfer={layer.channels[0].transfer}
                  onChange={setRgbTransfer}
                />
              </div>
            )}
            {layer.__typename === "PhasorLayer" && layer.phasors[0] && (
              <PhasorNodeEditor
                layer={layer}
                node={layer.phasors[0]}
                onChange={setPhasorNode}
              />
            )}
          </CardSection>
          {/* The metadata + placement chrome every layer card offers. Passing
              no editor is what keeps the graph section out. */}
          <LayerGraphFlyout inline layer={layer} onUpdate={onUpdate} onClose={onClose} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
