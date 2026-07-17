import { useState } from "react";
import type { ProbeResult } from "../core/probe/probeTypes";
import { isSameProbeKey } from "../core/probe/probeTypes";
import type {
  AttributeColumnLike,
  AttributeRow,
  PlanRowsState,
} from "../core/attributes/attributeTypes";
import { useViewerStore } from "../store/viewerStore";

/**
 * "What is under this pixel?" — the probe HUD section rendering the active
 * probe's attribute-plan results: one block per attached table, its 0..n rows
 * (plural is the plan contract), and a lazy `references` follow-up per
 * referencing column. Pure store consumer: all data arrives via
 * `probedAttributes` (written by AttributeProbeTracker), so no GraphQL hook
 * mounts here and no extra Guard is needed.
 */

const formatCell = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return String(value);
    return String(Number(value.toPrecision(5)));
  }
  return String(value);
};

const StatusBadge = ({ state }: { state: PlanRowsState }) => {
  if (state.status === "pending") {
    return (
      <span className="rounded bg-white/10 px-1 text-[9px] font-medium text-white/40">…</span>
    );
  }
  if (state.status === "rows") {
    return state.sampleSource === "exact" ? (
      <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-medium text-emerald-300">
        exact
      </span>
    ) : (
      <span className="rounded bg-white/10 px-1 text-[9px] font-medium text-white/50">~LOD</span>
    );
  }
  return null;
};

const ReferenceFollowUp = ({
  column,
  value,
}: {
  column: AttributeColumnLike;
  value: number | bigint;
}) => {
  const follow = useViewerStore((s) => s.followAttributeReference);
  const [state, setState] = useState<
    | { phase: "collapsed" }
    | { phase: "loading" }
    | { phase: "rows"; rows: readonly AttributeRow[] }
    | { phase: "error" }
  >({ phase: "collapsed" });

  if (!column.references || !follow) return null;

  const expand = async () => {
    setState({ phase: "loading" });
    try {
      const rows = await follow(column, value);
      setState(rows ? { phase: "rows", rows } : { phase: "error" });
    } catch {
      setState({ phase: "error" });
    }
  };

  if (state.phase === "collapsed") {
    return (
      <button
        className="pointer-events-auto rounded border border-white/10 bg-white/5 px-1 text-[9px] text-white/60 hover:bg-white/15 hover:text-white"
        title={`Look up in ${column.references.name}`}
        onClick={() => void expand()}
      >
        → {column.references.name}
      </button>
    );
  }
  if (state.phase === "loading") {
    return <span className="text-[9px] text-white/40">…</span>;
  }
  if (state.phase === "error") {
    return <span className="text-[9px] text-red-300/70">lookup failed</span>;
  }
  return (
    <div className="col-span-2 ml-2 space-y-0.5 border-l border-white/10 pl-2">
      {state.rows.length === 0 && (
        <span className="text-[10px] text-white/40">no matching row</span>
      )}
      {state.rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[auto_1fr] gap-x-2">
          {Object.entries(row).map(([name, cell]) => (
            <RowCellPair key={name} name={name} value={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

const RowCellPair = ({ name, value }: { name: string; value: unknown }) => (
  <>
    <span className="truncate text-[10px] text-white/50">{name}</span>
    <span className="text-right font-mono text-[10px] text-white/90">{formatCell(value)}</span>
  </>
);

const AttributeRowBlock = ({
  row,
  attributes,
}: {
  row: AttributeRow;
  attributes: readonly AttributeColumnLike[];
}) => (
  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
    {Object.entries(row).map(([name, cell]) => {
      const column = attributes.find((candidate) => candidate.name === name);
      const referenceValue =
        typeof cell === "number" || typeof cell === "bigint" ? cell : null;
      return (
        <div key={name} className="contents">
          <RowCellPair name={column?.longName ?? name} value={cell} />
          {column?.references && referenceValue !== null && (
            <div className="col-span-2 text-right">
              <ReferenceFollowUp column={column} value={referenceValue} />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export const AttributeRowsSection = ({ probe }: { probe: ProbeResult }) => {
  const probedAttributes = useViewerStore((s) => s.probedAttributes);

  if (!probedAttributes || !isSameProbeKey(probe, probedAttributes.key)) return null;
  const planKeys = Object.keys(probedAttributes.byPlan);
  if (planKeys.length === 0) return null;

  return (
    <div className="space-y-1">
      {planKeys.map((planKey) => {
        const state = probedAttributes.byPlan[planKey];
        const meta = probedAttributes.planMeta[planKey];
        // Unreachable plans are honest absences, not errors — hide them.
        if (state.status === "unreachable") return null;
        return (
          <div
            key={planKey}
            className="space-y-0.5 rounded border border-white/10 bg-white/5 px-2 py-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[10px] font-medium text-white/60">
                {meta?.tableName ?? "attributes"}
              </span>
              <span className="flex items-center gap-1.5">
                {state.sampledValue !== undefined && state.sampledValue !== null && (
                  <span className="font-mono text-[10px] text-white/70">
                    #{String(state.sampledValue)}
                  </span>
                )}
                <StatusBadge state={state} />
              </span>
            </div>
            {state.status === "background" && (
              <span className="text-[10px] text-white/40">background</span>
            )}
            {state.status === "error" && (
              <span className="text-[10px] text-red-300/70">{state.error ?? "failed"}</span>
            )}
            {state.status === "rows" && state.rows.length === 0 && (
              <span className="text-[10px] text-white/40">
                no row for this object (never measured)
              </span>
            )}
            {state.status === "rows" &&
              state.rows.map((row, index) => (
                <AttributeRowBlock
                  key={index}
                  row={row}
                  attributes={meta?.attributes ?? []}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};
