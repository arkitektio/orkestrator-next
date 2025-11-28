import { CommandMenu } from "@/command/Menu";
import { Identifier } from "@/types";
import { useMemo } from "react";
import { PageLayout, PageVariant } from "./PageLayout";
import { MultiSidebar } from "./MultiSidebar";
import { Komments } from "@/lok-next/components/komments/Komments";
import { KnowledgeSidebar } from "@/kraph/components/sidebars/KnowledgeSidebar";
import { ExportSidebar } from "../sidebars/export";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: string) => void;
};

export const ModelPageLayout = ({
  sidebars,
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
        "Knowledge": <KnowledgeSidebar identifier={identifier} object={object} />,


      }} sidebarKey="DetailModel" />}
      actions={actions}
      variant={variant}
      pageActions={pageActions}
    >
      <CommandMenu objects={objects} />
      {children}
    </PageLayout>
  );
};
