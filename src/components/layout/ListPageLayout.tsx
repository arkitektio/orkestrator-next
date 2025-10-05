import { Identifier } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";
import { ContextMenu } from "../ui/context-menu";
import { CommandMenu } from "@/command/Menu";
import { MultiSidebar } from "./MultiSidebar";
import { HelpSidebar } from "../sidebars/help";

export type ListPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  title?: React.ReactNode;
  help?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: string) => void;
};

export const ListPageLayout = ({
  sidebars,
  title,
  children,
  identifier,
  variant,
  actions,
  pageActions,
}: ListPageLayoutProps) => {
  return (
    <div className="h-full w-full">
      <PageLayout
        title={title}
        sidebars={sidebars || <MultiSidebar map={{ Help: <HelpSidebar /> }} />}
        actions={actions}
        variant={variant}
        pageActions={pageActions}
      >
        <CommandMenu returns={[identifier]} />
        {children}
      </PageLayout>
    </div>
  );
};
