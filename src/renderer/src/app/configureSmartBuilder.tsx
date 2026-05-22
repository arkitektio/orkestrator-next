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
import { lazy, Suspense } from "react";

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
