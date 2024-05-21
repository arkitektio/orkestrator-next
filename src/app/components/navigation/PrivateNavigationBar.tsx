import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroppableNavLink } from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Me } from "@/lok-next/components/Me";
import { useDebug } from "@/providers/debug/DebugContext";
import { useArkitektConnect, useArkitektLogin } from "@jhnnsrs/arkitekt";
import { LokNextGuard } from "@jhnnsrs/lok-next";
import { HomeIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Bug,
  Database,
  Podcast,
  Settings,
  ShoppingBasket,
  Users2,
  Workflow,
} from "lucide-react";
import React from "react";
import { GoWorkflow } from "react-icons/go";
import { IconContext } from "react-icons/lib";
import { PiDatabaseLight } from "react-icons/pi";
import { TbBugOff } from "react-icons/tb";
import { ModeToggle } from "../ModeToggle";

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
  const { logout } = useArkitektLogin();
  const { remove, fakts } = useArkitektConnect();
  const { debug, setDebug } = useDebug();

  const linkChildren =
    (fakts &&
      Object.keys(fakts).map((key) => {
        if (key == "self") return null;
        const faktsValue = fakts[key];
        return (
          <DroppableNavLink key={key} to={`/${key}`}>
            {({ isActive }) => (
              <Tooltip>
                <TooltipTrigger>
                  <NavigationMenuLink active={isActive}>
                    {matchIcon(key)}
                  </NavigationMenuLink>
                </TooltipTrigger>
                <TooltipContent side="right">{key}</TooltipContent>
              </Tooltip>
            )}
          </DroppableNavLink>
        );
      })) ||
    [];

  return (
    <NavigationMenu
      className="mx-auto px-1 max-w-[40px] mt-3 flex flex-grow sm:flex-col flex-row gap-8  items-center justify-start h-full py-3"
      orientation="vertical"
    >
      <IconContext.Provider
        value={{
          size: "2em",
          style: { stroke: "0.3px" },
        }}
      >
        <div className="flex-grow  flex-col flex gap-8 ">
          <div className="flex-grow"></div>
          {linkChildren}
          <div className="flex-grow"></div>
        </div>

        <Button
          variant="ghost"
          className="text-foreground"
          onClick={() => setDebug(!debug)}
        >
          {debug ? <Bug /> : <TbBugOff />}
        </Button>

        <DroppableNavLink
          key={"Settings"}
          to={"settings"}
          className={"text-foreground"}
        >
          {({ isActive }) => (
            <NavigationMenuLink active={isActive}>
              <Settings />
            </NavigationMenuLink>
          )}
        </DroppableNavLink>

        <LokNextGuard fallback={<></>}>
          <DropdownMenu>
            <DropdownMenuTrigger className="mb-2">
              <Me />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="p-2 mb-2 border-seperator"
            >
              <DropdownMenuLabel>Hello </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DroppableNavLink
                  to={"/user/settings"}
                  className={({ isActive }) =>
                    ` dark:hover:text-back-400 px-2 py-2 
              ${isActive ? "dark:text-back-400" : "text-back-500"}`
                  }
                >
                  Open Settings
                </DroppableNavLink>
              </DropdownMenuGroup>

              <div className="flex flex-row gap-2">
                <Button onClick={() => logout()}>Logout</Button>{" "}
                <Button onClick={() => remove()}>Unconnect</Button>{" "}
                <ModeToggle />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </LokNextGuard>
      </IconContext.Provider>
    </NavigationMenu>
  );
};

export { PrivateNavigationBar };
