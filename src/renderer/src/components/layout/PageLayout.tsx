import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, PanelLeft, PanelRight, Clipboard, Check } from "lucide-react";
import { useCallback, useState } from "react";
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
import { useReport } from "@/hooks/use-report";

export type PageVariant = "black" | "default";

export type PageLayoutProps = {
  title: React.ReactNode | undefined;
  children: React.ReactNode;
  sidebars?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: "black" | "default";
};

export const PageLayout = ({
  title = "Loading...",
  sidebars,
  children,
  pageActions,
  variant = "default",
}: PageLayoutProps) => {
  const [params, setParams] = useSearchParams({
    pageSidebar: "true",
    sidebar: "true",
  });

  const location = useLocation();


  const reportBug = useReport();

  const [copied, setCopied] = useState(false);

  const copyPathToClipboard = useCallback(() => {

    const searchText = `${location.pathname}${location.search}`;
    const fullUrl = `https://arkitekt.live/deeplink?orkestrator=${encodeURIComponent(searchText)}`;

    // Try modern clipboard API first
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => {
          // Fallback to electron API if available
          const api = (window as any).api;
          if (api?.copyToClipboard) {
            api.copyToClipboard(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }
        });
    } else {
      // Try electron API
      const api = (window as any).api;
      if (api?.copyToClipboard) {
        api.copyToClipboard(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        // Last resort: old-school execCommand
        try {
          const textarea = document.createElement("textarea");
          textarea.value = fullUrl;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (e) {
          console.warn("Failed to copy to clipboard", e);
        }
      }
    }
  }, [location.pathname, location.search]);

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
      <ResizablePanel className="h-full w-full" defaultSize={80} id="page" order={1}>
        <div
          className={cn(
            "h-full w-full flex flex-col ",
            variant == "default" ? "bg-radial-[at_100%_100%] from-background to-backgroundpaired" : "bg-black text-gray-300",
          )}
        >
          <div
            className={cn(
              "h-16 flex-row flex justify-between flex-initial dark:border-gray-700 px-2 py-2 items-center",
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
              <div className="flex-shrink ">
                <BreadCrumbs />
              </div>
            </div>
            <div className="flex-initial text-foreground flex flex-row gap-1 max-w-lg">

              {pageActions}


              <ButtonGroup className="flex-initial">
                <Button variant="ghost" onClick={togglePageSidebar} className="!pl-2 !pr-2"><PanelRight /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
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
                    <DropdownMenuItem onSelect={copyPathToClipboard}>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={copyPathToClipboard}>
                      Share Universal Link
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={popOut}> Popout</DropdownMenuItem>
                    <DropdownMenuItem onSelect={reportBug}> Report Bug</DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>

            </div>
          </div>

          <div className="p-3 flex-grow @container flex flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      </ResizablePanel>
      {params.get("pageSidebar") == "true" && (
        <>
          <ResizableHandle  />
          <ResizablePanel
            minSize={10}
            maxSize={80}
            defaultSize={20}
            order={2}
            className={cn(
              "bg-sidebar l",
              variant == "default" ? "" : "border-0 bg-sidebar bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 ",
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
