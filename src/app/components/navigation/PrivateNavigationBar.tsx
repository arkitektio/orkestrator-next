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
import { LogoutButton, UnconnectButton } from "@jhnnsrs/arkitekt";
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

export type INavigationBarProps = {
  children?: React.ReactNode;
};

/**
 * The private navigation bar is the main navigation bar of the application.
 * It is only visible to authenticated users.
 * It contains links to the different applications of the Arkitekt platform.
 * All links to respective modules should be wrapped in their respective guards, so that
 * only modules that are available to the user are shown. See the example below.
 */
const PrivateNavigationBar: React.FC<INavigationBarProps> = ({ children }) => {
  return (
    <NavigationMenu
      className="flex flex-grow sm:flex-col flex-row gap-8  items-center justify-start h-full bg-background dark:bg-background"
      orientation="vertical"
    >
      <div className="hidden flex-initial mt-2  font-light text-xl md:block  border-b-gray-600 ">
        <Link to={"/"}>
          <ArkitektLogo
            width={"4rem"}
            height={"4rem"}
            cubeColor={"hsl(var(--primary))"}
            aColor={"hsl(var(--foreground))"}
            strokeColor={"hsl(var(--foreground))"}
          />
        </Link>
      </div>

      <IconContext.Provider
        value={{
          size: "2em",
          style: { stroke: "0.3px", color: "hsl(var(--primary))" },
        }}
      >
        <div className="flex-grow  flex-col flex gap-8 ">
          <RekuestGuard>
            <DroppableNavLink key={"Dashboard"} to={"rekuest"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <HomeIcon className="w-8 h-8 mx-auto " />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </RekuestGuard>

          <MikroNextGuard>
            <DroppableNavLink key={"Dashboard"} to={"mikronext"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <PiDatabaseLight />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </MikroNextGuard>
          <OmeroArkGuard>
            <DroppableNavLink key={"Dashboard"} to={"omero-ark"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <PiDatabaseLight />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </OmeroArkGuard>
          <RekuestGuard>
            <DroppableNavLink key={"Reaktion"} to={"reaktion"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <GoWorkflow />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </RekuestGuard>
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
              <LogoutButton>
                <Button>Logout</Button>{" "}
              </LogoutButton>
              <UnconnectButton>
                {" "}
                <Button>Unconnect</Button>{" "}
              </UnconnectButton>
              <ModeToggle />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </IconContext.Provider>
    </NavigationMenu>
  );
};

export { PrivateNavigationBar };
