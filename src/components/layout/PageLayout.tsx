import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, PanelLeft, PanelRight } from "lucide-react";
import { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import BreadCrumbs from "../navigation/BreadCrumbs";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Actionbar } from "./Actionbar";
import { useReport } from "@/hooks/use-report";

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


  const reportBug = useReport();

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
      <ResizablePanel className="" defaultSize={80} id="page" order={1}>
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
              <span className="sr-only">Toggle ModulePane</span>
            </Button>
            <Separator dir="vertical" className="w-2" />
            <div className="flex-grow flex flex-col truncate">
              <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-xl truncate max-w-[70%]">
                {title}
              </h1>
              <div className="flex-shrink ">
                <BreadCrumbs />
              </div>
            </div>
            <div className="flex-initial text-foreground flex flex-row items-center gap-1">

              {pageActions}

              <ButtonGroup>
                <Button variant="ghost" onClick={togglePageSidebar} className="!pl-2 !pr-2"><PanelRight /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="!pl-2 !pr-2">
                      <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="[--radius:1rem]">
                    <DropdownMenuItem onSelect={togglePageSidebar}>
                      {params.get("pageSidebar") == "true" ? "Hide" : "Show"} Page
                      Sidebar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={toggleSidebar}>
                      {params.get("sidebar") == "true" ? "Hide" : "Show"} Sidebar
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={popOut}> Popout</DropdownMenuItem>
                    <DropdownMenuItem onSelect={reportBug}> Report Bug</DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>

            </div>
          </div>

          <div className="p-3 flex-grow @container flex flex-col overflow-y-auto overflow-x-hidden">
            {children}
          </div>
          <Actionbar>{actions}</Actionbar>
        </div>
      </ResizablePanel>
      {params.get("pageSidebar") == "true" && (
        <>
          <ResizableHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-seperator" />
          <ResizablePanel
            minSize={10}
            maxSize={80}
            defaultSize={20}
            order={2}
            className={cn(
              "border-l-1 border bg-pane dark:border-gray-700 dark:bg-sidebar",
              variant == "default" ? "" : "border-0 bg-black",
            )}
            id="sidebar"
          >
            {sidebars}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
