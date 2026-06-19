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
import { ComponentType, ReactNode } from "react";
import { Komments } from "@/lok-next/components/komments/Komments";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";
import { StructureRoomsSidebar } from "@/alpaka/sidebars/StructureRoomsSidebar";
import ImageHoverCard from "@/mikro-next/components/hovers/ImageHoverCard";
import FileHoverCard from "@/mikro-next/components/hovers/FileHoverCard";
import DatasetHoverCard from "@/mikro-next/components/hovers/DatasetHoverCard";
import ActionHoverCard from "@/rekuest/components/hovers/ActionHoverCard";
import AgentHoverCard from "@/rekuest/components/hovers/AgentHoverCard";
import AssignationHoverCard from "@/rekuest/components/hovers/AssignationHoverCard";
import ImplementationHoverCard from "@/rekuest/components/hovers/ImplementationHoverCard";
import NeuronModelHoverCard from "@/elektro/components/hovers/NeuronModelHoverCard";
import SimulationHoverCard from "@/elektro/components/hovers/SimulationHoverCard";
import ExperimentHoverCard from "@/elektro/components/hovers/ExperimentHoverCard";

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
  "@mikro/image": { Component: ImageHoverCard, Guard: Guard.Mikro },
  "@mikro/file": { Component: FileHoverCard, Guard: Guard.Mikro },
  "@mikro/dataset": { Component: DatasetHoverCard, Guard: Guard.Mikro },
  "@rekuest/action": { Component: ActionHoverCard, Guard: Guard.Rekuest },
  "@rekuest/agent": { Component: AgentHoverCard, Guard: Guard.Rekuest },
  "@rekuest/assignation": {
    Component: AssignationHoverCard,
    Guard: Guard.Rekuest,
  },
  "@rekuest/implementation": {
    Component: ImplementationHoverCard,
    Guard: Guard.Rekuest,
  },
  "@elektro/neuronmodel": {
    Component: NeuronModelHoverCard,
    Guard: Guard.Elektro,
  },
  "@elektro/simulation": {
    Component: SimulationHoverCard,
    Guard: Guard.Elektro,
  },
  "@elektro/experiment": {
    Component: ExperimentHoverCard,
    Guard: Guard.Elektro,
  },
};

configureSmartBuilder({
  renderKomments: ({ identifier, object }) => {
    return <Komments identifier={identifier} object={object} />;
  },
  renderKnowledge: ({ identifier, object }) => {
    return <KnowledgeSidebar identifier={identifier} object={object} />;
  },
  renderHover: ({ identifier, object }) => {
    const entry = hoverCards[identifier];
    if (!entry) {
      return null;
    }
    const { Component, Guard: ModuleGuard } = entry;
    return (
      <ModuleGuard>
        <Component object={object} />
      </ModuleGuard>
    );
  },
  renderModelPage: ({ identifier, children, ...props }: SmartModelPage & { identifier: string }) => {
    const roomsSidebar = (
      <StructureRoomsSidebar identifier={identifier} object={props.object} />
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
