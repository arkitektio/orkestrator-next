import { ArkitektLogo } from "@/app/components/logos/ArkitektLogo";
import { Link } from "react-router-dom";

export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen sm:flex-row bg-background  dark:text-white">
      <div className="flex-initial flex flex-col mt-1 z-10 w-19 shadow shadow-xl bg-background">
        <div className="flex-initial h-12 border-b-gray-600 mt-2">
          <Link to={"/"}>
            <ArkitektLogo
              width={"100%"}
              height={"100%"}
              cubeColor={"hsl(var(--primary))"}
              aColor={"hsl(var(--foreground))"}
              strokeColor={"hsl(var(--foreground))"}
            />
          </Link>
        </div>
        {navigationBar}
      </div>
      <div className="flex-grow flex overflow-y-auto z-2 ml-1 my-1 rounded  border-1 border border-gray-400  dark:border-gray-700 bg-pane shadow shadow-xs mr-1 ">
        {children}
      </div>
    </div>
  );
};
