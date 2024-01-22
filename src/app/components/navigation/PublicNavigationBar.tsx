import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "@/components/ui/link";
import { ArkitektLogo } from "../logos/ArkitektLogo";
export type INavigationBarProps = {
  children?: React.ReactNode;
};

/**
 *
 *  The public navigation bar is the main navigation bar of the application.
 *  @todo: This component should be replaced with amore useful component for the public application.
 */

const PublicNavigationBar: React.FC<INavigationBarProps> = ({ children }) => {
  return (
    <div className="dark:text-white flex sm:flex-col h-full flex-row bg-slate-900 sm:pt-0 shadow-element overflow-hidden ">
      <div className="flex flex-grow sm:flex-col flex-row gap-8 mt-2 items-center">
        <div className="hidden flex-initial  font-light text-xl md:block text-slate-400 dark:text-slate-500 border-b-gray-600 ">
          <Link to={"/"}>
            <ArkitektLogo
              width={"4rem"}
              height={"4rem"}
              cubeColor={"rgb(var(--color-primary-300))"}
              aColor={"var(--color-back-700)"}
              strokeColor={"var(--color-back-700)"}
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-grow sm:flex-col flex-row gap-8  md:mt-3 md:ml-1"></div>
      <div className="flex flex-initial sm:flex-col flex-row gap-8 items-center">
        <Link to={"/user"}>
          <AiOutlineUser size={"2.6em"} style={{ stroke: "1px" }} />
        </Link>
      </div>
    </div>
  );
};

export { PublicNavigationBar };
