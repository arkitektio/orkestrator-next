import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import BreadCrumbs from "../navigation/BreadCrumbs";

export type PageLayoutProps = {
  children: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
};

export const PageLayout = ({ sidebars, children }: PageLayoutProps) => {
  return (
    <PanelGroup autoSaveId="persistence" direction="horizontal">
      <Panel className="">
        <div className="flex flex-col p-2">
          <div className="flex-shrink">
            <BreadCrumbs />
          </div>
          <div className="flex-grow @container">{children}</div>
        </div>
      </Panel>
      {sidebars && (
        <>
          <Panel>{sidebars}</Panel>
          <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-white" />
        </>
      )}
    </PanelGroup>
  );
};
