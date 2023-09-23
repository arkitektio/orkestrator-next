import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export type ModuleLayoutProps = {
  children: React.ReactNode;
  pane?: React.ReactNode;
};

export const ModuleLayout = ({ pane, children }: ModuleLayoutProps) => {
  return (
    <PanelGroup autoSaveId="module" direction="horizontal">
      {pane && (
        <>
          <Panel
            defaultSize={10}
            className="border-r border-gray-500 bg-background"
            style={{overflowY: "scroll"}}
          >
            {pane}
          </Panel>
          <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-accent translate-x-[-50%]" />
        </>
      )}

      <Panel defaultSize={90}>{children}</Panel>
    </PanelGroup>
  );
};
