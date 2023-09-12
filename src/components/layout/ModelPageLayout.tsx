import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BreadCrumbs from "../navigation/BreadCrumbs";
import { ScrollArea } from "../ui/scroll-area";
import { Smart } from "@/providers/smart/builder";
import { SmartModel } from "@/providers/smart/SmartModel";
import { Identifier } from "@/types";
import { Komments } from "@/lok-next/components/komments/Komments";
import { id } from "date-fns/locale";

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: string;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
};

export const ModelPageLayout = ({
  sidebars,
  children,
  identifier,
  object,
}: ModelPageLayoutProps) => {
  return (
    <PanelGroup autoSaveId="page" direction="horizontal">
      <Panel className="" defaultSize={80}>
        <div className="flex flex-col p-2">
          <div className="flex-shrink">
            <BreadCrumbs />
          </div>
          <ScrollArea className="flex-grow @container">{children}</ScrollArea>
        </div>
      </Panel>
      <>
        <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-seperator" />
        <Panel
          minSize={10}
          defaultSize={20}
          className="border-l-2 border-gray-900 bg-middleground p-3"
        >
          <Komments identifier={identifier} object={object} />
          {sidebars}
        </Panel>
      </>
    </PanelGroup>
  );
};
