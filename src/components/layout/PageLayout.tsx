import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BreadCrumbs from "../navigation/BreadCrumbs";
import { ScrollArea } from "../ui/scroll-area";
import { Actionbar } from "./Actionbar";

export type PageLayoutProps = {
  children: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
};

export const PageLayout = ({
  sidebars,
  children,
  actions,
}: PageLayoutProps) => {
  return (
    <PanelGroup autoSaveId="page" direction="horizontal">
      <Panel className="" defaultSize={80}>
        <div className="h-full flex flex-col p-2 relative">
          <div className="flex-shrink">
            <BreadCrumbs />
          </div>
          <ScrollArea className="flex-grow @container overflow-y-scroll">{children}</ScrollArea>
          <Actionbar>{actions}</Actionbar>
        </div>
      </Panel>
      {sidebars && (
        <>
          <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-seperator" />
          <Panel
            minSize={10}
            defaultSize={20}
            className="border-l-2 border-gray-900 bg-middleground"
          >
            {sidebars}
          </Panel>
        </>
      )}
    </PanelGroup>
  );
};
