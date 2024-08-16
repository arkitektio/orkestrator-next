import { Identifier } from "@/types";
import { PageLayout, PageVariant } from "./PageLayout";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: string;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
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
}: ModelPageLayoutProps) => {
  return (
    <PageLayout
      title={title}
      sidebars={<>{sidebars}</>}
      actions={actions}
      variant={variant}
    >
      {children}
    </PageLayout>
  );
};
