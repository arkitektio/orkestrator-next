import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BreadCrumbs from "../navigation/BreadCrumbs";
import { ScrollArea } from "../ui/scroll-area";
import { Smart } from "@/providers/smart/builder";
import { SmartModel } from "@/providers/smart/SmartModel";
import { Identifier } from "@/types";
import { Komments } from "@/lok-next/components/komments/Komments";
import { id } from "date-fns/locale";
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
}: ModelPageLayoutProps) => {


  return (
    <PageLayout title={title} sidebars={<>
    {sidebars}</>}>
      {children}
    </PageLayout>
  );
};
