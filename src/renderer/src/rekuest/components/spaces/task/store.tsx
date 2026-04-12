
// ── Task Space Store (single source of truth) ───────────────────────

import { useContext } from "react";
import { createContext } from "react";
import { createStore, useStore } from "zustand";
import * as THREE from "three";
import {
  DetailAssignationFragment,
  DetailAssignationQuery,
  PostmanAssignationFragment,
} from "@/rekuest/api/graphql";
import {
  SpaceGroup,
  SpaceGroupPlacement,
  TimelineDependencyGroup,
  TimelineEvent,
  TimelineItem,
  TimelineMethodRow,
} from "./types";

// ── helpers ──────────────────────────────────────────────────────────

function notEmpty<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

const dependencyCandidateToLabel = (candidate: unknown): string | undefined => {
  if (typeof candidate === "string" || typeof candidate === "number") {
    const label = String(candidate).trim();
    return label.length > 0 ? label : undefined;
  }
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return undefined;

  const obj = candidate as Record<string, unknown>;
  for (const key of ["name", "title", "reference", "key", "id"]) {
    const value = obj[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

const getEndTime = (a: PostmanAssignationFragment) => {
  if (a.finishedAt) return new Date(a.finishedAt).getTime();
  if (a.events && a.events.length > 0) {
    const times = a.events.map((e) => new Date(e.createdAt).getTime());
    if (times.length > 0) return Math.max(...times);
  }
  return new Date().getTime();
};

// ── derived data builders ────────────────────────────────────────────

function buildSpaceGroups(
  resolvedDependencies: DetailAssignationQuery["assignation"]["resolvedDependencies"],
  rootAgent?: { id: string; name: string; placements: DetailAssignationQuery["assignation"]["resolvedDependencies"][0]["mappedAgents"][0]["agent"]["placements"] } | null,
): SpaceGroup[] {
  const groupMap = new Map<string, SpaceGroup>();

  // Add root agent placements first (marked as root)
  if (rootAgent) {
    for (const placement of rootAgent.placements) {
      const spaceId = placement.space.id;
      if (!groupMap.has(spaceId)) {
        groupMap.set(spaceId, { spaceId, placements: [] });
      }
      groupMap.get(spaceId)!.placements.push({
        id: placement.id,
        name: placement.name,
        agentName: rootAgent.name,
        agentId: rootAgent.id,
        isRoot: true,
        model: placement.model ?? null,
        affineMatrix: placement.affineMatrix,
      });
    }
  }

  for (const dep of resolvedDependencies) {
    for (const mapping of dep.mappedAgents) {
      for (const placement of mapping.agent.placements) {
        const spaceId = placement.space.id;
        if (!groupMap.has(spaceId)) {
          groupMap.set(spaceId, { spaceId, placements: [] });
        }
        groupMap.get(spaceId)!.placements.push({
          id: placement.id,
          name: placement.name,
          agentName: mapping.agent.name,
          agentId: mapping.agent.id,
          model: placement.model ?? null,
          affineMatrix: placement.affineMatrix,
        });
      }
    }
  }

  return Array.from(groupMap.values());
}

function buildAgentToAssignationMap(
  resolvedDependencies: DetailAssignationQuery["assignation"]["resolvedDependencies"],
  children: PostmanAssignationFragment[],
): Map<string, string[]> {
  // dependency key → agent IDs
  const depKeyToAgentIds = new Map<string, Set<string>>();
  for (const dep of resolvedDependencies) {
    const agents = new Set<string>();
    for (const mapping of dep.mappedAgents) {
      agents.add(mapping.agent.id);
    }
    depKeyToAgentIds.set(dep.key, agents);
  }

  // agent ID → assignation IDs
  const agentToAssignations = new Map<string, string[]>();
  for (const child of children) {
    const depKey = child.dependency?.trim() || "catch-all";
    const agentIds = depKeyToAgentIds.get(depKey);
    if (agentIds) {
      for (const agentId of agentIds) {
        if (!agentToAssignations.has(agentId)) {
          agentToAssignations.set(agentId, []);
        }
        agentToAssignations.get(agentId)!.push(child.id);
      }
    }
  }
  return agentToAssignations;
}

function buildTimeline(children: PostmanAssignationFragment[]): {
  groups: TimelineDependencyGroup[];
  events: TimelineEvent[];
  startTime: number;
  endTime: number;
} {
  if (children.length === 0) {
    return { groups: [], events: [], startTime: 0, endTime: 0 };
  }

  const times = children.flatMap((a) => [
    new Date(a.createdAt).getTime(),
    getEndTime(a),
  ]);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const interpolate = (t: number) => (max === min ? 0 : (t - min) / (max - min));

  const groupMap = new Map<string, TimelineDependencyGroup>();
  const methodMap = new Map<string, Map<string, TimelineMethodRow>>();

  for (const a of children) {
    const dependencyMethod = a.dependencyMethod?.trim() || "dynamic";
    const dependencyKey = a.dependency?.trim() || "catch-all";

    const dependencies = a.dependencies;
    const dependenciesByKey =
      dependencies && typeof dependencies === "object" && !Array.isArray(dependencies)
        ? (dependencies as Record<string, unknown>)
        : undefined;

    const selectedDependencyValue = dependenciesByKey?.[dependencyKey];
    const selectedMethodValue =
      selectedDependencyValue &&
      typeof selectedDependencyValue === "object" &&
      !Array.isArray(selectedDependencyValue)
        ? (selectedDependencyValue as Record<string, unknown>)[dependencyMethod]
        : undefined;

    const dependencyLabel = dependencyKey === "catch-all" ? "Catch-all dependency" : dependencyKey;
    const resolvedDepLabel = dependencyCandidateToLabel(selectedDependencyValue);
    const resolvedMethodLabel = dependencyCandidateToLabel(selectedMethodValue);

    const startTime = new Date(a.createdAt).getTime();
    const endTime = getEndTime(a);

    const item: TimelineItem = {
      assignation: a,
      start: interpolate(startTime),
      end: interpolate(endTime),
      startTime,
      endTime,
      events: [],
    };

    if (!groupMap.has(dependencyKey)) {
      groupMap.set(dependencyKey, {
        id: dependencyKey,
        dependency: dependencyLabel,
        summary: resolvedDepLabel ? `resolved via ${resolvedDepLabel}` : "Dependency group",
        items: [],
        methods: [],
      });
      methodMap.set(dependencyKey, new Map());
    }

    const group = groupMap.get(dependencyKey)!;
    group.items.push(item);

    const methodsForDep = methodMap.get(dependencyKey)!;
    if (!methodsForDep.has(dependencyMethod)) {
      const row: TimelineMethodRow = {
        id: `${dependencyKey}:${dependencyMethod}`,
        method: dependencyMethod,
        summary: resolvedMethodLabel || resolvedDepLabel || "Delegated path",
        items: [],
      };
      methodsForDep.set(dependencyMethod, row);
      group.methods.push(row);
    }
    methodsForDep.get(dependencyMethod)!.items.push(item);
  }

  const groups = Array.from(groupMap.values())
    .map((g) => ({
      ...g,
      methods: [...g.methods].sort((a, b) => a.method.localeCompare(b.method)),
    }))
    .sort((a, b) => a.dependency.localeCompare(b.dependency));

  return { groups, events: [], startTime: min, endTime: max };
}

// ── active-at-timepoint ──────────────────────────────────────────────

function computeActiveAtTimepoint(
  timepoint: number,
  children: PostmanAssignationFragment[],
  agentToAssignationIds: Map<string, string[]>,
): {
  assignationIds: Set<string>;
  agentIds: Set<string>;
  implementationIds: Set<string>;
} {
  const assignationIds = new Set<string>();
  const implementationIds = new Set<string>();

  for (const child of children) {
    const start = new Date(child.createdAt).getTime();
    const end = child.finishedAt
      ? new Date(child.finishedAt).getTime()
      : Date.now();

      console.log(`Checking assignation ${child.id} with time range[${start}, ${end}] against timepoint ${timepoint}`);
    if (timepoint >= start && timepoint <= end) {
      assignationIds.add(child.id);
      if (child.implementation?.id) {
        implementationIds.add(child.implementation.id);
      }
    }
  }

  const agentIds = new Set<string>();
  for (const [agentId, aIds] of agentToAssignationIds) {
    for (const aId of aIds) {
      if (assignationIds.has(aId)) {
        agentIds.add(agentId);
        break;
      }
    }
  }

  return { assignationIds, agentIds, implementationIds };
}

// ── store interface ──────────────────────────────────────────────────

interface SpaceViewState {
  task: DetailAssignationFragment;

  // Spaces
  spaceGroups: SpaceGroup[];
  allPlacements: SpaceGroupPlacement[];

  // Root agent
  rootAgentId: string | null;

  // Active at selected timepoint
  activeAssignationIds: Set<string>;
  activeAgentIds: Set<string>;
  activeImplementationIds: Set<string>;

  // Timeline
  timelineGroups: TimelineDependencyGroup[];
  timelineEvents: TimelineEvent[];
  timelineStartTime: number;
  timelineEndTime: number;

  // Selection & highlighting
  selectedTimepoint: number;
  selectedPlacementId: string | null;
  selectedAgentId: string | null;
  selectedDependencyId: string | null;
  highlightedAssignationIds: string[];

  // Agent → assignation mapping
  agentToAssignationIds: Map<string, string[]>;

  // Camera data for 3D→2D projection
  viewProjectionMatrix: THREE.Matrix4 | null;
  viewportSize: { width: number; height: number };

  // Debug
  debugWireframe: boolean;

  // Actions
  updateCameraData: (matrix: THREE.Matrix4, size: { width: number; height: number }) => void;
  selectPlacement: (id: string | null) => void;
  selectAgent: (id: string | null) => void;
  selectDependency: (id: string | null) => void;
  selectTimepoint: (timestamp: number) => void;
  setHighlightedAssignationIds: (ids: string[]) => void;
  toggleDebugWireframe: () => void;
  refreshTimeline: (task: DetailAssignationFragment) => void;
}

export const createSpaceViewStore = (task: DetailAssignationFragment) => {
  const children = (task.children || []).filter(notEmpty);
  const rootAgent = task.implementation?.agent ?? null;
  const rootAgentId = rootAgent?.id ?? null;
  const spaceGroups = buildSpaceGroups(task.resolvedDependencies, rootAgent);
  const allPlacements = spaceGroups.flatMap((g) => g.placements);
  const agentToAssignationIds = buildAgentToAssignationMap(task.resolvedDependencies, children);
  const { groups, startTime, endTime } = buildTimeline(children);
  const initialActive = computeActiveAtTimepoint(startTime, children, agentToAssignationIds);

  const parentEvents: TimelineEvent[] = (task.events || []).map((e) => ({
    kind: e.kind,
    message: e.message,
    createdAt: e.createdAt,
    position: endTime === startTime ? 0 : (new Date(e.createdAt).getTime() - startTime) / (endTime - startTime),
  }));

  return createStore<SpaceViewState>((set, get) => ({
    task,
    spaceGroups,
    allPlacements,
    rootAgentId,
    activeAssignationIds: initialActive.assignationIds,
    activeAgentIds: initialActive.agentIds,
    activeImplementationIds: initialActive.implementationIds,
    timelineGroups: groups,
    timelineEvents: parentEvents,
    timelineStartTime: startTime,
    timelineEndTime: endTime,
    agentToAssignationIds,

    selectedTimepoint: startTime,
    selectedPlacementId: null,
    selectedAgentId: null,
    selectedDependencyId: null,
    highlightedAssignationIds: [],

    viewProjectionMatrix: null,
    viewportSize: { width: 0, height: 0 },

    debugWireframe: false,

    updateCameraData: (matrix, size) => set({ viewProjectionMatrix: matrix, viewportSize: size }),

    selectPlacement: (id) => {
      if (id === null) {
        set({ selectedPlacementId: null, selectedAgentId: null, highlightedAssignationIds: [] });
        return;
      }
      const placement = get().allPlacements.find((p) => p.id === id);
      const agentId = placement?.agentId ?? null;
      const highlighted = agentId ? get().agentToAssignationIds.get(agentId) ?? [] : [];
      set({ selectedPlacementId: id, selectedAgentId: agentId, highlightedAssignationIds: highlighted });
    },

    selectAgent: (id) => {
      const highlighted = id ? get().agentToAssignationIds.get(id) ?? [] : [];
      set({ selectedAgentId: id, highlightedAssignationIds: highlighted });
    },

    selectDependency: (id) => set({ selectedDependencyId: id }),

    selectTimepoint: (timestamp) => {
      const { task: currentTask, agentToAssignationIds: currentMap } = get();
      const currentChildren = (currentTask.children || []).filter(notEmpty);
      const active = computeActiveAtTimepoint(timestamp, currentChildren, currentMap);
      set({
        selectedTimepoint: timestamp,
        activeAssignationIds: active.assignationIds,
        activeAgentIds: active.agentIds,
        activeImplementationIds: active.implementationIds,
        highlightedAssignationIds: [...active.assignationIds],
      });
    },

    setHighlightedAssignationIds: (ids) => set({ highlightedAssignationIds: ids }),

    toggleDebugWireframe: () => set((s) => ({ debugWireframe: !s.debugWireframe })),

    refreshTimeline: (updatedTask) => {
      const updatedChildren = (updatedTask.children || []).filter(notEmpty);
      const updatedRootAgent = updatedTask.implementation?.agent ?? null;
      const updatedRootAgentId = updatedRootAgent?.id ?? null;
      const updatedSpaceGroups = buildSpaceGroups(updatedTask.resolvedDependencies, updatedRootAgent);
      const updatedAllPlacements = updatedSpaceGroups.flatMap((g) => g.placements);
      const updatedAgentMap = buildAgentToAssignationMap(updatedTask.resolvedDependencies, updatedChildren);
      const updatedActive = computeActiveAtTimepoint(get().selectedTimepoint, updatedChildren, updatedAgentMap);
      const { groups: tGroups, startTime: sT, endTime: eT } = buildTimeline(updatedChildren);
      const updatedParentEvents: TimelineEvent[] = (updatedTask.events || []).map((e) => ({
        kind: e.kind,
        message: e.message,
        createdAt: e.createdAt,
        position: eT === sT ? 0 : (new Date(e.createdAt).getTime() - sT) / (eT - sT),
      }));

      set({
        task: updatedTask,
        rootAgentId: updatedRootAgentId,
        activeAssignationIds: updatedActive.assignationIds,
        activeAgentIds: updatedActive.agentIds,
        activeImplementationIds: updatedActive.implementationIds,
        highlightedAssignationIds: [...updatedActive.assignationIds],
        spaceGroups: updatedSpaceGroups,
        allPlacements: updatedAllPlacements,
        agentToAssignationIds: updatedAgentMap,
        timelineGroups: tGroups,
        timelineEvents: updatedParentEvents,
        timelineStartTime: sT,
        timelineEndTime: eT,
      });
    },
  }));
};

type SpaceViewStore = ReturnType<typeof createSpaceViewStore>;

export const SpaceViewStoreContext = createContext<SpaceViewStore | null>(null);

export function useSpaceViewStore<T>(selector: (s: SpaceViewState) => T): T {
  const store = useContext(SpaceViewStoreContext);
  if (!store) throw new Error("Missing SpaceViewStoreContext");
  return useStore(store, selector);
}
