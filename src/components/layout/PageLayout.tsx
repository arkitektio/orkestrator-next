import { GearIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import BreadCrumbs from "../navigation/BreadCrumbs";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Actionbar } from "./Actionbar";

export type PageLayoutProps = {
  title: string | undefined;
  children: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
};

export const PageLayout = ({
  title = "Loading...",
  sidebars,
  children,
  actions,
  pageActions,
}: PageLayoutProps) => {
  const [params, setParams] = useSearchParams({
    pageSidebar: "true",
    sidebar: "true",
  });

  const popOut = useCallback(() => {
    window.open(
      window.location.href,
      "_blank",
      "toolbar=no,scrollbars=yes,resizable=yes,top=500,left=500,width=1000,height=400",
    );
  }, []);

  const togglePageSidebar = useCallback(() => {
    setParams({
      pageSidebar: params.get("pageSidebar") == "true" ? "false" : "true",
      sidebar: params.get("sidebar") || "true",
    });
  }, [params]);

  const toggleSidebar = useCallback(() => {
    setParams({
      sidebar: params.get("sidebar") == "true" ? "false" : "true",
      pageSidebar: params.get("pageSidebar") || "true",
    });
  }, [params]);

  return (
    <ResizablePanelGroup autoSaveId="page" direction="horizontal">
      <ResizablePanel className="" defaultSize={80}>
        <div className="h-full w-full flex flex-col  relative">
          <div className="h-16 flex-row flex justify-between f-exinitial border-b dark:border-gray-700 px-2 py-2">
            <div className="flex flex flex-col">
              <h1 className="text-2xl font-semibold text-foreground">
                {title}
              </h1>
              <div className="flex-shrink ">
                <BreadCrumbs />
              </div>
            </div>
            <div className="flex-shrink text-foreground ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
                    <GearIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={togglePageSidebar}>
                    {params.get("pageSidebar") == "true" ? "Hide" : "Show"} Page
                    Sidebar
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={toggleSidebar}>
                    {params.get("sidebar") == "true" ? "Hide" : "Show"} Sidebar
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={popOut}> Popout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-3 flex-grow @container flex flex-col">
            {children}
          </div>
          <Actionbar>{actions}</Actionbar>
        </div>
      </ResizablePanel>
      {sidebars && params.get("pageSidebar") == "true" && (
        <>
          <ResizableHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-seperator" />
          <ResizablePanel
            minSize={10}
            defaultSize={20}
            className="border-l-1 border bg-pane dark:border-gray-700 dark:bg-sidebar"
          >
            {sidebars}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
