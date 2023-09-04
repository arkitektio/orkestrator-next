import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export type ModuleLayoutProps = {
  children: React.ReactNode;
  pane?: React.ReactNode;
};

export const ModuleLayout = ({ pane, children }: ModuleLayoutProps) => {
  return (
    <PanelGroup autoSaveId="persistence" direction="horizontal">
      {pane && (
        <>
          <Panel className="border-r-2 border bg-muted ">{pane}</Panel>
          <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-white" />
        </>
      )}

      <Panel>{children}</Panel>
    </PanelGroup>
  );
};
