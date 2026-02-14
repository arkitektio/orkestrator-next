import { CommandMenu } from "@/command/Menu";
import { Identifier } from "@/types";
import { useMemo } from "react";
import { PageLayout, PageVariant } from "./PageLayout";
import { MultiSidebar } from "./MultiSidebar";
import { Komments } from "@/lok-next/components/komments/Komments";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";
import { ExportSidebar } from "../sidebars/export";
import { RunsSidebar } from "@/rekuest/sidebars/RunsSidebar";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { Guard } from "@/app/Arkitekt";

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

  return (
    <PageLayout
      title={title}
      sidebars={sidebars ? <>{sidebars}</> : <MultiSidebar map={{
        "Comments": <Komments identifier={identifier} object={object} />,
        "Knowledge": <Guard.Kraph><KnowledgeSidebar identifier={identifier} object={object} /></Guard.Kraph>,
        "Tasks": <RunsSidebar identifier={identifier} object={object} />,
        ...additionalSidebars,
      }} sidebarKey="DetailModel" />}
      variant={variant}
      pageActions={pageActions || <ObjectButton  objects={objects} />}
    >
      <CommandMenu objects={objects} />
      {children}
    </PageLayout>
  );
};
