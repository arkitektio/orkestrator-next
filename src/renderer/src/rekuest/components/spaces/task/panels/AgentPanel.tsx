// ── Agent Panel (projected from 3D → 2D, rendered outside Canvas) ────

import { useMemo } from "react";
import { useSpaceViewStore } from "../store";
import { SpaceGroupPlacement } from "../types";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { RekuestAgent } from "@/linkers";
import { AssignationEventKind } from "@/rekuest/api/graphql";

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

export const AgentPanel = ({ placements }: { placements: SpaceGroupPlacement[] }) => {
  const selectedId = useSpaceViewStore((s) => s.selectedPlacementId);
  const vpMatrix = useSpaceViewStore((s) => s.viewProjectionMatrix);
  const vpSize = useSpaceViewStore((s) => s.viewportSize);
  const selectPlacement = useSpaceViewStore((s) => s.selectPlacement);
  const selectedTimepoint = useSpaceViewStore((s) => s.selectedTimepoint);
  const task = useSpaceViewStore((s) => s.task);
  const agentToAssignationIds = useSpaceViewStore((s) => s.agentToAssignationIds);

  const selected = placements.find((p) => p.id === selectedId);

  // checkout agent state at selected timepoint
  const agentStateAtTimepoint = useMemo(() => {
    if (!selected) return null;
    const assignationIds = agentToAssignationIds.get(selected.agentId) ?? [];
    const children = (task.children ?? []).filter(
      (c) => c && assignationIds.includes(c.id),
    );

    return children.map((child) => {
      if (!child) return null;
      // find latest event at or before timepoint
      const events = (child.events ?? [])
        .filter((e) => new Date(e.createdAt).getTime() <= selectedTimepoint)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      const latestEvent = events[0] ?? null;

      return {
        id: child.id,
        name: child.action?.name ?? child.id,
        latestEventKind: latestEvent?.kind ?? child.latestEventKind,
        message: latestEvent?.message ?? null,
      };
    }).filter(Boolean);
  }, [selected, selectedTimepoint, task, agentToAssignationIds]);

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

      {/* state at timepoint */}
      {agentStateAtTimepoint && agentStateAtTimepoint.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-border/40 pt-2 mt-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            State @ {new Date(selectedTimepoint).toLocaleTimeString()}
          </div>
          {agentStateAtTimepoint.map((s) => {
            if (!s) return null;
            const badge = getStatusBadge(s.latestEventKind);
            return (
              <div key={s.id} className="flex items-center gap-2 text-xs">
                <span className={`rounded px-1 py-0.5 text-[10px] ${badge.cls}`}>
                  {badge.label}
                </span>
                <span className="truncate">{s.name}</span>
              </div>
            );
          })}
        </div>
      )}

      <RekuestAgent.DetailLink
        object={{ id: selected.agentId }}
        className="text-xs text-primary hover:underline"
      >
        Open Agent →
      </RekuestAgent.DetailLink>
    </Card>
  );
};
