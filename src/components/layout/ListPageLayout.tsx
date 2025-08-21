import { Identifier } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";
import { ContextMenu } from "../ui/context-menu";
import { CommandMenu } from "@/command/Menu";

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

export const ListPageLayout = ({
  sidebars,
  title,
  children,
  identifier,
  object,
  variant,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {
  return (
    <div className="h-full w-full">
      <PageLayout
        title={title}
        sidebars={<>{sidebars}</>}
        actions={actions}
        variant={variant}
        pageActions={pageActions}
      >
        <CommandMenu returns={{ identifier, object }} />
        {children}
      </PageLayout>
    </div>
  );
};
