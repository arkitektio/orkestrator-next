import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
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
    <ResizablePanelGroup autoSaveId="page" direction="horizontal">
      <ResizablePanel className="" defaultSize={80}>
        <div className="h-full flex flex-col p-2 relative">
          <div className="flex-shrink">
            <BreadCrumbs />
          </div>
          <ScrollArea className="flex-grow @container overflow-y-auto">
            {children}
          </ScrollArea>
          <Actionbar>{actions}</Actionbar>
        </div>
      </ResizablePanel>
      {sidebars && (
        <>
          <ResizableHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-seperator" />
          <ResizablePanel
            minSize={10}
            defaultSize={20}
            className="border-l-2 border-gray-900 bg-middleground"
          >
            <ScrollArea className="flex flex-col h-full overflow-y-auto">
              {sidebars}
            </ScrollArea>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
