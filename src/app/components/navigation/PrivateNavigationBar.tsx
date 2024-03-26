import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroppableNavLink, Link } from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Me } from "@/lok-next/components/Me";
import { useArkitektConnect, useArkitektLogin } from "@jhnnsrs/arkitekt";
import { LokNextGuard } from "@jhnnsrs/lok-next";
import { MikroNextGuard } from "@jhnnsrs/mikro-next";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { HomeIcon } from "@radix-ui/react-icons";
import React from "react";
import { IconContext } from "react-icons/lib";
import { PiDatabaseLight } from "react-icons/pi";
import { TbDashboard } from "react-icons/tb";
import { GoWorkflow } from "react-icons/go";
import { ModeToggle } from "../ModeToggle";
import { ArkitektLogo } from "../logos/ArkitektLogo";
import { OmeroArkGuard } from "@jhnnsrs/omero-ark";
import { PortGuard } from "@jhnnsrs/port-next";
import { LucideLayoutDashboard } from "lucide-react";
import { FlussGuard } from "@jhnnsrs/fluss-next";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export type INavigationBarProps = {
  children?: React.ReactNode;
};



export const matchIcon = (key: string) => {
  switch (key) {

  case "rekuest":
    return <LucideLayoutDashboard className="w-8 h-8 mx-auto " />;
  case "mikronext":
    return <PiDatabaseLight className="w-8 h-8 mx-auto " />;
  case "omero-ark":
    return <PiDatabaseLight className="w-8 h-8 mx-auto " />;
  case "port-next":
    return <PiDatabaseLight className="w-8 h-8 mx-auto "  />;
  case "reaktion":
    return <GoWorkflow className="w-8 h-8 mx-auto " />;
  case "lok":
    return <GoWorkflow className="w-8 h-8 mx-auto " />;
  case "settings":
    return <GoWorkflow className="w-8 h-8 mx-auto " />;
  default:
    return <HomeIcon className="w-8 h-8 mx-auto " />;
  }
}



/**
 * The private navigation bar is the main navigation bar of the application.
 * It is only visible to authenticated users.
 * It contains links to the different applications of the Arkitekt platform.
 * All links to respective modules should be wrapped in their respective guards, so that
 * only modules that are available to the user are shown. See the example below.
 */
const PrivateNavigationBar: React.FC<INavigationBarProps> = ({ children }) => {
  const { logout, } = useArkitektLogin();
  const { remove, fakts } = useArkitektConnect();


  const linkChildren = fakts && Object.keys(fakts).map((key) => {
    const faktsValue = fakts[key]
    return <DroppableNavLink key={key} to={`/${key}`}>{({ isActive }) => (
      <Tooltip>
      <TooltipTrigger><NavigationMenuLink active={isActive}>
       {matchIcon(key)}
      </NavigationMenuLink></TooltipTrigger>
      <TooltipContent side="right">{faktsValue.name || key}</TooltipContent>
      </Tooltip>
    )}</DroppableNavLink>
}) || []

  return (
    <NavigationMenu
    className="mx-auto px-1 max-w-[40px] mt-3 flex flex-grow sm:flex-col flex-row gap-8  items-center justify-start h-full "
    orientation="vertical"
    >

      <IconContext.Provider
        value={{
          size: "2em",
          style: { stroke: "0.3px", color: "hsl(var(--primary))" },
        }}
      >
        <div className="flex-grow  flex-col flex gap-8 ">
          {linkChildren}


          <RekuestGuard fallback={<></>}>
            <DroppableNavLink key={"Dashboard"} to={"rekuest"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <LucideLayoutDashboard className="w-8 h-8 mx-auto " />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </RekuestGuard>

          <MikroNextGuard fallback={<></>}>
            <DroppableNavLink key={"Dashboard"} to={"mikronext"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <PiDatabaseLight />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </MikroNextGuard>
          <OmeroArkGuard fallback={<></>}>
            <DroppableNavLink key={"Dashboard"} to={"omero-ark"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <PiDatabaseLight />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </OmeroArkGuard>
          <PortGuard fallback={<></>}>
            <DroppableNavLink key={"Dashboard"} to={"port-next"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <PiDatabaseLight />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </PortGuard>
          <FlussGuard fallback={<></>}>
            <DroppableNavLink key={"Reaktion"} to={"reaktion"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <GoWorkflow />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </FlussGuard>
          <LokNextGuard fallback={<></>}>
            <DroppableNavLink key={"Lok"} to={"lok"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <GoWorkflow />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </LokNextGuard>
          <DroppableNavLink key={"Settings"} to={"settings"}>
            {({ isActive }) => (
              <NavigationMenuLink active={isActive}>
                <GoWorkflow />
              </NavigationMenuLink>
            )}
          </DroppableNavLink>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="mb-2">
            <LokNextGuard>
              <Me />
            </LokNextGuard>
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
              <Button onClick={() => remove()}>Unconnect</Button> <ModeToggle />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </IconContext.Provider>
    </NavigationMenu>
  );
};

export { PrivateNavigationBar };
