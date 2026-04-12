// ── Agent Panel (projected from 3D → 2D, rendered outside Canvas) ────

import { useMemo } from "react";
import { useSpaceViewStore } from "../store";
import { SpaceGroupPlacement } from "../types";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { RekuestAgent } from "@/linkers";
import { AssignationEventKind, StateFragment, useAgentQuery, useCheckoutAgentQuery } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { AsyncBoundary } from "@/components/boundaries/AsyncBoundary";
import { useDebounce } from "@/hooks/use-debounce";

const getStatusBadge = (kind: AssignationEventKind | undefined | string) => {
  switch (kind) {
    case AssignationEventKind.Done:
      return { label: "Done", cls: "bg-emerald-500/20 text-emerald-400" };
    case AssignationEventKind.Yield:
      return { label: "Yield", cls: "bg-violet-500/20 text-violet-400" };
    case AssignationEventKind.Error:
      return { label: "Error", cls: "bg-rose-500/20 text-rose-400" };
    case AssignationEventKind.Assign:
      return { label: "Running", cls: "bg-sky-500/20 text-sky-400" };
    default:
      return { label: String(kind ?? "—"), cls: "bg-muted text-muted-foreground" };
  }
};

const AgentStateValueDisplay = ({
  state,
  value,
}: {
  state: StateFragment;
  value: Record<string, unknown>;
}) => {
  const { registry } = useWidgetRegistry();

  return (
    <Card className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2">
      {state.definition.ports.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <div className="flex flex-col gap-2" key={index}>
            <label className="text-xs text-muted-foreground">{port.key}</label>
            <Widget
              key={index}
              value={value?.[port.key] as never}
              port={port}
              widget={port.widget}
            />
          </div>
        );
      })}
    </Card>
  );
};



const AgentCheckoutPanel = ({
  agentId,
}: {
  agentId: string;
}) => {

  const { data} = useAgentQuery({
    variables: {
      id: agentId,
    }
  })

  const timepoint = useSpaceViewStore((s) => s.selectedTimepoint);


  const debouncedTimepoint = useDebounce(timepoint, 200);


  const { data: revData, error, loading } = useCheckoutAgentQuery({
    variables: {
      agent: agentId,
      timestamp: debouncedTimepoint ? new Date(debouncedTimepoint).toISOString() : undefined,
    },
  });


  return (
    <AsyncBoundary>
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Revision</span>
            <span className="font-mono">
              {revData?.checkoutAgent.globalRevision}
            </span>
            {loading && <span className="text-yellow-500">loading…</span>}
          </div>
        </div>
        <div className="grid gap-4">
          {data?.agent?.states.map((state) =>{

            const value = useMemo(() => {
              if (!revData || revData.checkoutAgent.agentId !== agentId) return undefined;
              return revData.checkoutAgent.values[state.interface];
            }, [revData, state.id, agentId]);



            return <div key={state.id} className="space-y-2 rounded-lg border p-4">
              <h3 className="text-sm font-semibold">{state.definition.name}</h3>
              <AgentStateValueDisplay state={state} value={value ?? {}} />
            </div>
})}
        </div>
      </div>
    </AsyncBoundary>

  );
};















export const AgentPanel = ({ placements }: { placements: SpaceGroupPlacement[] }) => {


  const selectedId = useSpaceViewStore((s) => s.selectedPlacementId);
  const vpMatrix = useSpaceViewStore((s) => s.viewProjectionMatrix);
  const vpSize = useSpaceViewStore((s) => s.viewportSize);
  const selectPlacement = useSpaceViewStore((s) => s.selectPlacement);

  const selected = placements.find((p) => p.id === selectedId);



  const screenPos = useMemo(() => {
    if (!selected || !vpMatrix || !vpSize) return null;

    const mat = new THREE.Matrix4();
    const affine = selected.affineMatrix as number[][];
    if (affine && affine.length >= 4) {
      mat.set(
        affine[0][0], affine[0][1], affine[0][2], affine[0][3],
        affine[1][0], affine[1][1], affine[1][2], affine[1][3],
        affine[2][0], affine[2][1], affine[2][2], affine[2][3],
        affine[3][0], affine[3][1], affine[3][2], affine[3][3],
      );
    }

    const worldVec = new THREE.Vector3();
    worldVec.setFromMatrixPosition(mat);
    worldVec.applyMatrix4(vpMatrix);

    if (worldVec.z < -1 || worldVec.z > 1) return null;

    return {
      x: (worldVec.x * 0.5 + 0.5) * vpSize.width,
      y: (worldVec.y * -0.5 + 0.5) * vpSize.height,
    };
  }, [selected, vpMatrix, vpSize]);

  if (!selected || !screenPos) return null;

  return (
    <Card
      className="absolute z-20 shadow-2xl backdrop-blur-md p-3 flex flex-col gap-2 min-w-[200px] max-w-[300px] pointer-events-auto"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        transform: "translate(-50%, -110%)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{selected.agentName}</div>
          <div className="text-[11px] text-muted-foreground">{selected.name}</div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground text-xs"
          onClick={() => selectPlacement(null)}
        >
          ✕
        </button>
      </div>


      <AgentCheckoutPanel agentId={selected.agentId} />



      <RekuestAgent.DetailLink
        object={{ id: selected.agentId }}
        className="text-xs text-primary hover:underline"
      >
        Open Agent →
      </RekuestAgent.DetailLink>
    </Card>
  );
};
