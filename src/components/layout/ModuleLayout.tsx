import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { useSearchParams } from "react-router-dom";

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
            className="border-r dark:border-gray-700 bg-sidebar"
          >
            <ScrollArea className="flex flex-col h-full overflow-y-hidden">
              {pane}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle className="h-full opacity-0 hover:opacity-80 bg-accent translate-x-[-50%]" />
        </>
      )}

      <ResizablePanel defaultSize={90}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};
