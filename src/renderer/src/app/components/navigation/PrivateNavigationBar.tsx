import { Arkitekt, moduleRegistry } from "@/app/Arkitekt";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroppableNavLink } from "@/components/ui/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Me, Username } from "@/lok-next/components/Me";
import { useDebug } from "@/providers/debug/DebugContext";
import { ChatBubbleIcon, DashIcon, HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  AlertTriangle,
  Bug,
  ChevronUp,
  Database,
  Podcast,
  RefreshCw,
  Settings,
  ShoppingBasket,
  Users2,
  Workflow,
} from "lucide-react";
import React from "react";
import { BsLightning } from "react-icons/bs";
import { GoWorkflow } from "react-icons/go";
import { IconContext } from "react-icons/lib";
import { MdStream } from "react-icons/md";
import { PiDatabaseLight, PiGraph } from "react-icons/pi";
import { TbBugOff } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { ArkitektLogo } from "../logos/ArkitektLogo";
import { BackLogo } from "../logos/BackLogo";

export type INavigationBarProps = {
  children?: React.ReactNode;
};

const matchIcon = (key: string) => {
  switch (key) {
    case "rekuest":
      return <Podcast className="w-8 h-8 mx-auto text-foreground" />;
    case "mikro":
      return <Database className="w-8 h-8 mx-auto text-foreground" />;
    case "omero_ark":
      return <PiDatabaseLight className="w-8 h-8 mx-auto text-foreground" />;
    case "fluss":
      return <Workflow className="w-8 h-8 mx-auto text-foreground" />;
    case "lok":
      return <Users2 className="w-8 h-8 mx-auto text-foreground" />;
    case "settings":
      return <GoWorkflow className="w-8 h-8 mx-auto text-foreground" />;
    case "kabinet":
      return <ShoppingBasket className="w-8 h-8 mx-auto text-foreground" />;
    case "kraph":
      return <PiGraph className="w-8 h-8 mx-auto text-foreground" />;
    case "alpaka":
      return <ChatBubbleIcon className="w-8 h-8 mx-auto text-foreground p-[0.5]" />;
    case "dokuments":
      return <DashIcon className="w-8 h-8 mx-auto text-foreground" />;
    case "lovekit":
      return <MdStream className="w-8 h-8 mx-auto text-foreground p-[0.5]" />;
    case "elektro":
      return <BsLightning className="w-8 h-8 mx-auto text-foreground" />;
    default:
      return <HomeIcon className="w-8 h-8 mx-auto text-foreground" />;
  }
};

const ModuleNavItem = ({ moduleKey, mobile = false }: { moduleKey: string; mobile?: boolean }) => {
  const availableModules = Arkitekt.useAvailableModules();
  const arkitekt = Arkitekt.useArkitekt();
  const moduleState = availableModules.find((entry) => entry.key === moduleKey);

  if (!moduleState) {
    return null;
  }

  const icon = matchIcon(moduleKey);
  const isInteractive = moduleState.status === "ready" || moduleState.status === "checking";
  const isChecking = moduleState.status === "checking";
  const isInvalid = moduleState.status === "invalid";

  const buttonContent = (
    <div className="relative flex items-center justify-center">
      <div className={cn(isInvalid ? "opacity-35 grayscale" : "", isChecking ? "animate-pulse" : "")}>{icon}</div>
      {isInvalid && <AlertTriangle className="absolute -right-1 -top-1 h-3 w-3 text-amber-500" />}
    </div>
  );

  if (isInteractive) {
    return (
      <DroppableNavLink key={moduleKey} to={moduleState.route} className={mobile ? "cursor-pointer" : undefined}>
        {({ isActive }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuLink
                active={isActive}
                className={cn(
                  "flex-1 cursor-pointer",
                  isActive ? "bg-primary" : "",
                  isChecking ? "opacity-80" : "",
                )}
              >
                {buttonContent}
              </NavigationMenuLink>
            </TooltipTrigger>
            <TooltipContent side={mobile ? "top" : "right"}>
              {moduleState.definition.label || moduleState.key}
            </TooltipContent>
          </Tooltip>
        )}
      </DroppableNavLink>
    );
  }

  return (
    <Popover key={moduleKey}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 hover:bg-muted/40",
                mobile ? "w-full" : "",
              )}
            >
              {buttonContent}
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side={mobile ? "top" : "right"}>
          {moduleState.definition.label || moduleState.key}
        </TooltipContent>
      </Tooltip>
      <PopoverContent side={mobile ? "top" : "right"}>
        <PopoverHeader>
          <PopoverTitle>{moduleState.definition.label || moduleState.key}</PopoverTitle>
          <PopoverDescription>
            This module is configured, but one or more required services are currently invalid.
          </PopoverDescription>
        </PopoverHeader>
        <div className="space-y-2">
          {moduleState.errors.map((error) => (
            <div key={error} className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs">
              {error}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => {
              void arkitekt.retryModule(moduleKey);
            }}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PrivateNavigationBar: React.FC<INavigationBarProps> = () => {
  const disconnect = Arkitekt.useDisconnect();
  const reconnect = Arkitekt.useReconnect();
  const configurationIssues = Arkitekt.useConfigurationIssues();
  const availableModules = Arkitekt.useAvailableModules();
  const connection = Arkitekt.useConnection();
  const hasLokProfile = Boolean(connection?.selfService);
  const { debug, setDebug } = useDebug();

  const navigate = useNavigate();
  const location = useLocation();

  const moduleOrder = Object.keys(moduleRegistry).filter((key) =>
    availableModules.some((entry) => entry.key === key),
  );

  const onClick = () => {
    if (window.electron) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const reload = () => {
    if (window.api) {
      window.api.reloadWindow();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <div
        className="flex-initial h-10 w-10 justify-center items-center flex cursor-pointer mb-3"
        onClick={onClick}
      >
        {location.pathname === "/" ? (
          <ArkitektLogo
            width={"100%"}
            height={"100%"}
            cubeColor={"var(--primary)"}
            aColor={"var(--foreground)"}
            strokeColor={"var(--foreground)"}
          />
        ) : (
          <BackLogo
            width={"100%"}
            height={"100%"}
            cubeColor={"var(--primary)"}
            aColor={"var(--foreground)"}
            strokeColor={"var(--foreground)"}
          />
        )}
      </div>

      <div className="flex-grow flex-row md:flex-col flex justify-start md:gap-2 items-center gap-2 overflow-hidden md:flex hidden">
        {moduleOrder.map((moduleKey) => (
          <ModuleNavItem key={moduleKey} moduleKey={moduleKey} />
        ))}
      </div>

      <div className="flex-grow block md:hidden">
        <Drawer>
          <DrawerTrigger className="flex w-full h-full justify-start items-start">
            <IconContext.Provider value={{ className: "w-8 h-8 mx-auto text-foreground" }}>
              <Button variant="ghost" className="w-full h-full">
                <ChevronUp />
              </Button>
            </IconContext.Provider>
          </DrawerTrigger>
          <DrawerContent className="p-2 mb-2 border-seperator grid grid-cols-1 gap-2">
            {moduleOrder.map((moduleKey) => (
              <div key={moduleKey} className="flex flex-col rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">
                    {moduleRegistry[moduleKey]?.label || moduleKey}
                  </div>
                  <ModuleNavItem moduleKey={moduleKey} mobile />
                </div>
              </div>
            ))}
          </DrawerContent>
        </Drawer>
      </div>

      <div className="flex-initial h-12 w-12 items-center flex flex-col justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-foreground h-12 w-12">
            {hasLokProfile ? <Me /> : <div className="h-12 w-12 rounded-full border" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-64 mb-2 border-border">
            <DropdownMenuLabel>
              {hasLokProfile ? <Username /> : <div>Guest</div>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {configurationIssues.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs text-amber-600 dark:text-amber-400">
                  Configuration issues detected
                </div>
                {configurationIssues.slice(0, 3).map((issue) => (
                  <div key={issue} className="px-2 py-1 text-xs text-muted-foreground">
                    {issue}
                  </div>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => setDebug(!debug)}>
              {debug ? <Bug className="mr-2 h-4 w-4" /> : <TbBugOff className="mr-2 h-4 w-4" />}
              <span>Debug Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DroppableNavLink key={"Settings"} to={"settings"} className="w-full cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DroppableNavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex flex-row gap-2 w-full p-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => void disconnect()}>
                Disconnect
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => void reconnect()}>
                Reconnect
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="h-10 w-10 mt-2" onClick={reload}>
          <ReloadIcon />
        </Button>
      </div>
    </>
  );
};

export { PrivateNavigationBar };
