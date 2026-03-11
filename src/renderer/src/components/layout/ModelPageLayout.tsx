import { Guard } from "@/app/Arkitekt";
import { CommandMenu } from "@/command/Menu";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { RunsSidebar } from "@/rekuest/sidebars/RunsSidebar";
import { Identifier } from "@/types";
import { lazy, Suspense, useMemo } from "react";
import { MultiSidebar } from "./MultiSidebar";
import { PageLayout, PageVariant } from "./PageLayout";

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

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  additionalSidebars?: { [key: string]: React.ReactNode };
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: string) => void;
};

export const ModelPageLayout = ({
  sidebars,
  additionalSidebars,
  title,
  children,
  identifier,
  object,
  variant,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {
  const objects = useMemo(() => [{ identifier, object }], [identifier, object]);
  const kommentsSidebar = (
    <Suspense fallback={null}>
      <LazyKomments identifier={identifier} object={object} />
    </Suspense>
  );
  const knowledgeSidebar = (
    <Suspense fallback={null}>
      <LazyKnowledgeSidebar identifier={identifier} object={object} />
    </Suspense>
  );

  return (
    <PageLayout
      title={title}
      sidebars={sidebars ? <>{sidebars}</> : <MultiSidebar map={{
        "Comments": kommentsSidebar,
        "Knowledge": <Guard.Kraph>{knowledgeSidebar}</Guard.Kraph>,
        "Tasks": <RunsSidebar identifier={identifier} object={object} />,
        ...additionalSidebars,
      }} sidebarKey="DetailModel" />}
      variant={variant}
      actions={actions}
      pageActions={pageActions || <ObjectButton objects={objects} />}
    >
      <CommandMenu objects={objects} />
      {children}
    </PageLayout>
  );
};
