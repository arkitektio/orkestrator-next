import { Identifier } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
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
  return (
    <PageLayout
      title={title}
      sidebars={<>{sidebars}</>}
      actions={actions}
      variant={variant}
      pageActions={pageActions}
    >
      {children}
    </PageLayout>
  );
};
