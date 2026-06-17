import { EnhanceButton } from "@/alpaka/components/EnhanceButton";
import { Guard } from "@/app/Arkitekt";
import { ListPageLayout } from "@/components/layout/ListPageLayout";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import {
  configureSmartBuilder,
  SmartEnhanceButtonProps,
  SmartListPageProps,
  SmartModelPage,
  SmartNewButtonProps,
  SmartObjectButtonProps,
} from "@/providers/smart/buildSmartAdapters";
import { ObjectButton } from "@/providers/smart/extensions/context";
import { usePrimaryActionsQuery } from "@/rekuest/api/graphql";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";
import { ComponentType, lazy, ReactNode, Suspense } from "react";
import { HoverSkeleton } from "@/mikro-next/components/hovers/HoverShell";

const LazyKomments = lazy(() =>
  import("@/lok-next/components/komments/Komments").then((module) => ({
    default: module.Komments,
  })),
);

const LazyKnowledgeSidebar = lazy(() =>
  import("@/kraph/components/sidebars/KnowledgeSidebar").then((module) => ({
    default: module.KnowledgeSidebar,
  })),
);

const LazyStructureRoomsSidebar = lazy(() =>
  import("@/alpaka/sidebars/StructureRoomsSidebar").then((module) => ({
    default: module.StructureRoomsSidebar,
  })),
);

const LazyImageHoverCard = lazy(
  () => import("@/mikro-next/components/hovers/ImageHoverCard"),
);
const LazyFileHoverCard = lazy(
  () => import("@/mikro-next/components/hovers/FileHoverCard"),
);
const LazyDatasetHoverCard = lazy(
  () => import("@/mikro-next/components/hovers/DatasetHoverCard"),
);
const LazyActionHoverCard = lazy(
  () => import("@/rekuest/components/hovers/ActionHoverCard"),
);
const LazyAgentHoverCard = lazy(
  () => import("@/rekuest/components/hovers/AgentHoverCard"),
);
const LazyAssignationHoverCard = lazy(
  () => import("@/rekuest/components/hovers/AssignationHoverCard"),
);
const LazyImplementationHoverCard = lazy(
  () => import("@/rekuest/components/hovers/ImplementationHoverCard"),
);
const LazyNeuronModelHoverCard = lazy(
  () => import("@/elektro/components/hovers/NeuronModelHoverCard"),
);
const LazySimulationHoverCard = lazy(
  () => import("@/elektro/components/hovers/SimulationHoverCard"),
);
const LazyExperimentHoverCard = lazy(
  () => import("@/elektro/components/hovers/ExperimentHoverCard"),
);

// Maps a smart model identifier to the component rendered inside its on-demand
// hover card, together with the module guard that gates it. The hover cards run
// module-specific GraphQL (e.g. the mikro / rekuest backends), so the guard must
// wrap the component from the outside — that way its query hooks only mount once
// the relevant backend is `ready`, and nothing fires when the module is absent.
type HoverCardEntry = {
  Component: ComponentType<{ object: any }>;
  Guard: ComponentType<{ children: ReactNode }>;
};

const hoverCards: Record<string, HoverCardEntry> = {
  "@mikro/image": { Component: LazyImageHoverCard, Guard: Guard.Mikro },
  "@mikro/file": { Component: LazyFileHoverCard, Guard: Guard.Mikro },
  "@mikro/dataset": { Component: LazyDatasetHoverCard, Guard: Guard.Mikro },
  "@rekuest/action": { Component: LazyActionHoverCard, Guard: Guard.Rekuest },
  "@rekuest/agent": { Component: LazyAgentHoverCard, Guard: Guard.Rekuest },
  "@rekuest/assignation": {
    Component: LazyAssignationHoverCard,
    Guard: Guard.Rekuest,
  },
  "@rekuest/implementation": {
    Component: LazyImplementationHoverCard,
    Guard: Guard.Rekuest,
  },
  "@elektro/neuronmodel": {
    Component: LazyNeuronModelHoverCard,
    Guard: Guard.Elektro,
  },
  "@elektro/simulation": {
    Component: LazySimulationHoverCard,
    Guard: Guard.Elektro,
  },
  "@elektro/experiment": {
    Component: LazyExperimentHoverCard,
    Guard: Guard.Elektro,
  },
};

configureSmartBuilder({
  renderKomments: ({ identifier, object }) => {
    return (
      <Suspense fallback={null}>
        <LazyKomments identifier={identifier} object={object} />
      </Suspense>
    );
  },
  renderKnowledge: ({ identifier, object }) => {
    return (
      <Suspense fallback={null}>
        <LazyKnowledgeSidebar identifier={identifier} object={object} />
      </Suspense>
    );
  },
  renderHover: ({ identifier, object }) => {
    const entry = hoverCards[identifier];
    if (!entry) {
      return null;
    }
    const { Component, Guard: ModuleGuard } = entry;
    return (
      <ModuleGuard>
        <Suspense fallback={<HoverSkeleton />}>
          <Component object={object} />
        </Suspense>
      </ModuleGuard>
    );
  },
  renderModelPage: ({ identifier, children, ...props }: SmartModelPage & { identifier: string }) => {
    const roomsSidebar = (
      <Suspense fallback={null}>
        <LazyStructureRoomsSidebar identifier={identifier} object={props.object} />
      </Suspense>
    );

    return (
      <ModelPageLayout
        identifier={identifier}
        {...props}
        additionalSidebars={{
          ...props.additionalSidebars,
          Rooms: <Guard.Alpaka>{roomsSidebar}</Guard.Alpaka>,
        }}
      >
        {children}
      </ModelPageLayout>
    );
  },
  renderListPage: ({ identifier, children, ...props }: SmartListPageProps & { identifier: string }) => {
    return (
      <ListPageLayout identifier={identifier} {...props}>
        {children}
      </ListPageLayout>
    );
  },
  renderObjectButton: ({ identifier, object, ...props }: SmartObjectButtonProps & { identifier: string }) => {
    return <ObjectButton objects={[{ identifier, object }]} {...props} />;
  },
  renderNewButton: ({ identifier, ...props }: SmartNewButtonProps & { identifier: string }) => {
    return <ObjectButton returns={[identifier]} objects={[]} {...props} />;
  },
  renderEnhanceButton: ({ identifier, ...props }: SmartEnhanceButtonProps & { identifier: string }) => {
    return <EnhanceButton identifier={identifier} object={props.object} />;
  },
  useNodes: (identifier) => {
    return usePrimaryActionsQuery({
      variables: {
        identifier,
      },
    });
  },
  useProgress: (identifier, object) => {
    return useAssignProgress({
      identifier,
      object,
    });
  },
  useLive: (identifier, object) => {
    return useLiveAssignation({
      identifier,
      object,
    });
  },
});
