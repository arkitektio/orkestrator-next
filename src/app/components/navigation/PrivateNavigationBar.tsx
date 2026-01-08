import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroppableNavLink } from "@/components/ui/link";
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Arkitekt, Guard } from "@/lib/arkitekt/Arkitekt";
import { Me, Username } from "@/lok-next/components/Me";
import { useDebug } from "@/providers/debug/DebugContext";
import { ChatBubbleIcon, DashIcon, HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Bug,
  ChevronUp,
  Database,
  Podcast,
  Settings,
  ShoppingBasket,
  Users2,
  Workflow
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export type INavigationBarProps = {
  children?: React.ReactNode;
};

export const matchIcon = (key: string) => {
  switch (key) {
    case "rekuest":
      return <Podcast className="w-8 h-8 mx-auto text-foreground" />;
    case "mikro":
      return <Database className="w-8 h-8 mx-auto  text-foreground" />;
    case "omero-ark":
      return <PiDatabaseLight className="w-8 h-8 mx-auto  text-foreground" />;
    case "port-next":
      return <PiDatabaseLight className="w-8 h-8 mx-auto  text-foreground " />;
    case "fluss":
      return <Workflow className="w-8 h-8 mx-auto  text-foreground" />;
    case "lok":
      return <Users2 className="w-8 h-8 mx-auto  text-foreground" />;
    case "settings":
      return <GoWorkflow className="w-8 h-8 mx-auto  text-foreground" />;
    case "kabinet":
      return <ShoppingBasket className="w-8 h-8 mx-auto  text-foreground" />;
    case "kraph":
      return <PiGraph className="w-8 h-8 mx-auto ml- text-foreground" />;
    case "alpaka":
      return (
        <ChatBubbleIcon className="w-8 h-8 mx-auto  text-foreground p-[0.5]" />
      );
    case "dokuments":
      return <DashIcon className="w-8 h-8 mx-auto  text-foreground" />;
    case "lovekit":
      return <MdStream className="w-8 h-8 mx-auto  text-foreground p-[0.5]" />;
    case "elektro":
      return <BsLightning className="w-8 h-8 mx-auto  text-foreground" />;
    default:
      return <HomeIcon className="w-8 h-8 mx-auto  text-foreground" />;
  }
};

/**
 * The private navigation bar is the main navigation bar of the application.
 * It is only visible to authenticated users.
 * It contains links to the different applications of the Arkitekt platform.
 * All links to respective modules should be wrapped in their respective guards, so that
 * only modules that are available to the user are shown. See the example below.
 */
const PrivateNavigationBar: React.FC<INavigationBarProps> = () => {
  const disconnect = Arkitekt.useDisconnect();
  const reconnect = Arkitekt.useReconnect();
  const { debug, setDebug } = useDebug();
  const instances = Arkitekt.useAvailableServices();

  const navigate = useNavigate();
  const location = useLocation();

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
  }

  return (
    <>
      <div className="flex-initial h-12 w-12 justify-center items-center flex cursor-pointer " onClick={onClick}>
        {location.pathname == "/" ? (
          <ArkitektLogo
            width={"100%"}
            height={"100%"}
            cubeColor={"hsl(var(--primary))"}
            aColor={"hsl(var(--foreground))"}
            strokeColor={"hsl(var(--foreground))"}
          />
        ) : (
          <BackLogo

            width={"100%"}
            height={"100%"}
            cubeColor={"hsl(var(--primary))"}
            aColor={"hsl(var(--foreground))"}
            strokeColor={"hsl(var(--foreground))"}
          />
        )}
      </div>
      <div className="flex-grow flex-row md:flex-col flex justify-center  md:gap-6 items-center gap-2 overflow-hidden md:flex hidden">
        {instances.map((s) => {
          if (s.key == "self") return null;
          if (s.key == "datalayer") return null;
          if (s.key == "livekit") return null;
          if (s.key == "lovekit") return null;
          if (s.key == "dokuments") return null;
          return (
            <DroppableNavLink key={s.key} to={`/${s.key}`} >
              {({ isActive }) => (
                <Tooltip>
                  <TooltipTrigger>
                    <NavigationMenuLink active={isActive}>
                      {matchIcon(s.key)}
                    </NavigationMenuLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">{s.key}</TooltipContent>
                </Tooltip>
              )}
            </DroppableNavLink>
          );
        })}
      </div>
      <div className="flex-grow block md:hidden">
        <Drawer>
          <DrawerTrigger className="flex w-full h-full justify-center items-center">
            <IconContext.Provider
              value={{ className: "w-8 h-8 mx-auto  text-foreground" }}
            >
              <Button variant="ghost" className="w-full h-full">
                <ChevronUp />
              </Button>
            </IconContext.Provider>
          </DrawerTrigger>
          <DrawerContent
            className="p-2 mb-2 border-seperator grid grid-cols-1 gap-2"
          >
            {instances.map((s) => {
              if (s.key == "self") return null;
              if (s.key == "datalayer") return null;
              if (s.key == "livekit") return null;
              return (
                <DroppableNavLink key={s.key} to={`/${s.key}`} >
                  {({ isActive }) => (
                    <Tooltip>
                      <TooltipTrigger className="flex flex-col items-center">
                        <NavigationMenuLink active={isActive} className="flex-1">
                          {matchIcon(s.key)} {/* Show the name of the service below the icon */}
                        </NavigationMenuLink>
                        <div className="text-xs">{s.key}</div>

                      </TooltipTrigger>
                      <TooltipContent side="top">{s.key}</TooltipContent>
                    </Tooltip>
                  )}
                </DroppableNavLink>
              );
            })}
          </DrawerContent>
        </Drawer>

      </div>

      <div className="flex-initial h-12 w-12 items-center flex flex-col justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-foreground h-12 w-12">
            <Guard.Lok fallback={<div className="h-12 w-12"></div>}>
              <Me />
            </Guard.Lok>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            className="w-56 mb-2 border-border"
          >
            <DropdownMenuLabel>
              <Guard.Lok fallback={<div>Guest</div>}>
                <Username />
              </Guard.Lok>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDebug(!debug)}>
              {debug ? (
                <Bug className="mr-2 h-4 w-4" />
              ) : (
                <TbBugOff className="mr-2 h-4 w-4" />
              )}
              <span>Debug Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DroppableNavLink
                key={"Settings"}
                to={"settings"}
                className="w-full cursor-pointer flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DroppableNavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex flex-row gap-2 w-full p-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => reconnect()}
              >
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
