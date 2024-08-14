import { Identifier } from "@/types";
import { PageLayout } from "./PageLayout";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  title?: string;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
};

export const ModelPageLayout = ({
  sidebars,
  title,
  children,
  identifier,
  object,
  actions,
}: ModelPageLayoutProps) => {
  return (
    <PageLayout title={title} sidebars={<>{sidebars}</>} actions={actions}>
      {children}
    </PageLayout>
  );
};
