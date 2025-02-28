import { cn } from "@/lib/utils";
import { GearIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PanelLeft } from "lucide-react";

export type PageVariant = "black" | "default";

export type PageLayoutProps = {
  title: React.ReactNode | undefined;
  children: React.ReactNode;
  sidebars?: React.ReactNode;
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
};

export const PageLayout = ({
  title = "Loading...",
  sidebars,
  children,
  actions,
  pageActions,
  variant = "default",
}: PageLayoutProps) => {
  const [params, setParams] = useSearchParams({
    pageSidebar: "true",
    sidebar: "true",
  });

  const location = useLocation();

  const popOut = useCallback(() => {
    window.api.openSecondWindow(location.pathname);
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
      <ResizablePanel className="" defaultSize={80} id="page">
        <div
          className={cn(
            "h-full w-full flex flex-col  relative",
            variant == "default" ? "" : "bg-black text-gray-300",
          )}
        >
          <div
            className={cn(
              "h-16 flex-row flex justify-between flex-initial border-b dark:border-gray-700 px-2 py-2 items-center",
              variant == "default"
                ? ""
                : "border-0 bg-black bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 ",
            )}
          >
            <Button onClick={toggleSidebar} variant={"ghost"}>
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Separator dir="vertical" className="w-2"/>
            <div className="flex-grow flex flex-col">
              
              <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-2xl truncate">
                {title}
              </h1>
              <div className="flex-shrink ">
                <BreadCrumbs />
              </div>
            </div>
            <div className="flex-shrink text-foreground flex flex-row items-center">
              {pageActions}

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

          <div className="p-3 flex-grow @container flex flex-col overflow-y-auto overflow-x-hidden">
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
            className={cn(
              "border-l-1 border bg-pane dark:border-gray-700 dark:bg-sidebar",
              variant == "default" ? "" : "border-0 bg-black",
            )}
          >
            {sidebars}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
