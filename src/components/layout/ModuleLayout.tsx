import { ScrollArea } from "@radix-ui/react-scroll-area";
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
  return (
    <ResizablePanelGroup autoSaveId="module" direction="horizontal">
      {pane && (
        <>
          <ResizablePanel
            defaultSize={10}
            className="border-r border-gray-500 bg-background"
          >
            <ScrollArea className="flex flex-col h-full overflow-y-hidden">
              {pane}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-accent translate-x-[-50%]" />
        </>
      )}

      <ResizablePanel defaultSize={90}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};
