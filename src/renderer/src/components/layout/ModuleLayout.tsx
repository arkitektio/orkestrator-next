import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useSearchParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

export type ModuleLayoutProps = {
  children: React.ReactNode;
  pane?: React.ReactNode;
};

export const ModuleLayout = ({ pane, children }: ModuleLayoutProps) => {
  const [params, setParams] = useSearchParams({ sidebar: "true" });

  return (
    <ResizablePanelGroup autoSaveId="module" direction="horizontal">
      {pane && params.get("sidebar") == "true" && (
        <>
          <ResizablePanel
            defaultSize={10}
            minSize={10}
            maxSize={80}
            order={1}
            className="border-r dark:border-gray-700 bg-panel"
            id="sidebar-module"
          >
            <ScrollArea className="flex flex-col h-full overflow-y-hidden bg-pane">
              {pane}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}

      <ResizablePanel defaultSize={90} id="module" order={2}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
