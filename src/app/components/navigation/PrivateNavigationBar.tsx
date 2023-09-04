import { MikroNextGuard } from "@jhnnsrs/mikro-next";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import { FiSettings } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import { TbDashboard, TbHistory, TbLayoutDashboard } from "react-icons/tb";
import { TiArrowUp } from "react-icons/ti";
import {
  NavLink,
  NavLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SMART_MODEL_DROP_TYPE } from "../../../constants";
import { ArkitektLogo } from "../logos/ArkitektLogo";
import { DroppableNavLink, Link } from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Navigation } from "lucide-react";

export type INavigationBarProps = {
  children?: React.ReactNode;
};

const PrivateNavigationBar: React.FC<INavigationBarProps> = ({ children }) => {
  return (
    <NavigationMenu
      className="flex flex-grow sm:flex-col flex-row gap-8  items-center justify-start h-full "
      orientation="vertical"
    >
      <div className="hidden flex-initial mt-2  font-light text-xl md:block  border-b-gray-600 ">
        <Link to={"/"}>
          <ArkitektLogo
            width={"4rem"}
            height={"4rem"}
            cubeColor={"hsl(var(--accent))"}
            aColor={"hsl(var(--primary))"}
            strokeColor={"hsl(var(--primary))"}
          />
        </Link>
      </div>

      <IconContext.Provider
        value={{
          size: "2.3em",
          style: { stroke: "1px" },
        }}
      >
        <div className="flex-grow  flex-col flex gap-8 ">
          <RekuestGuard>
            <DroppableNavLink key={"Dashboard"} to={"rekuest"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <TbLayoutDashboard />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </RekuestGuard>
          <RekuestGuard>
            <DroppableNavLink key={"Reaktion"} to={"reaktion"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <TbLayoutDashboard />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </RekuestGuard>
          <MikroNextGuard>
            <DroppableNavLink key={"Dashboard"} to={"mikronext"}>
              {({ isActive }) => (
                <NavigationMenuLink active={isActive}>
                  <TbDashboard />
                </NavigationMenuLink>
              )}
            </DroppableNavLink>
          </MikroNextGuard>
        </div>

        <div>
          <DroppableNavLink
            to={"/user/settings"}
            className={({ isActive }) =>
              ` dark:hover:text-back-400 px-2 py-2 
              ${isActive ? "dark:text-back-400" : "text-back-500"}`
            }
          >
            <FiSettings size={"2.6em"} style={{ stroke: "1px" }} />
          </DroppableNavLink>
        </div>
      </IconContext.Provider>
    </NavigationMenu>
  );
};

export { PrivateNavigationBar };
