import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroppableNavLink } from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Arkitekt, Guard } from "@/lib/arkitekt/Arkitekt";
import { cn } from "@/lib/utils";
import { Me, Username } from "@/lok-next/components/Me";
import { useDebug } from "@/providers/debug/DebugContext";
import { ChatBubbleIcon, DashIcon, HomeIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Bug,
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
const PrivateNavigationBar: React.FC<INavigationBarProps> = ({ children }) => {
  const disconnect = Arkitekt.useDisconnect();
  const reconnect = Arkitekt.useReconnect();
  const { debug, setDebug } = useDebug();
  const services = Arkitekt.useServices();

  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    if (window.electron) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const linkChildren =
    services.map((s) => {
      if (s.key == "self") return null;
      if (s.key == "datalayer") return null;
      if (s.key == "livekit") return null;
      return (
        <DroppableNavLink key={s.key} to={`/${s.key}`}>
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
    }) || [];

  return (
    <NavigationMenu
      className=" px-1 w-full sm:flex-col flex-row gap-8 h-full overflow-hidden py-3"
      orientation="vertical"
    >
      <IconContext.Provider
        value={{
          size: "2em",
          style: { stroke: "0.3px" },
        }}
      >
        <div className="flex-initial h-12 w-12 border-b-gray-600 mt-2 mx-auto my-auto md:block hidden">
          <div onClick={onClick} className="cursor-pointer">
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
        </div>
        <div className="flex-grow flex-row md:flex-col justify-center flex gap-8 ">
          {linkChildren}
        </div>
        <div className="flex-initial flex-row md:flex-col justify-center items-center  gap-2 flex ">
          <Button
            variant="ghost"
            className={cn(
              "md:block text-foreground hidden mx-auto h-12 w-12",
              debug && "bg-red-500",
            )}
            onClick={() => setDebug(!debug)}
          >
            {debug ? <Bug /> : <TbBugOff />}
          </Button>
          <DroppableNavLink key={"Settings"} to={"settings"} className={""}>
            {({ isActive }) => (
              <NavigationMenuLink active={isActive}>
                <Settings />
              </NavigationMenuLink>
            )}
          </DroppableNavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-foreground  mx-auto h-12 w-12">
              <Guard.Lok fallback={<div className="h-8">No lok?</div>}>
                <Me />
              </Guard.Lok>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="p-2 mb-2 border-seperator"
            >
              <DropdownMenuLabel>
                <Guard.Lok fallback={<div>No lok?</div>}>
                  <Username />
                </Guard.Lok>
              </DropdownMenuLabel>

              <div className="flex flex-row gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Button>{" "}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => reconnect()}
                >
                  Reconnect
                </Button>{" "}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </IconContext.Provider>
    </NavigationMenu>
  );
};

export { PrivateNavigationBar };
