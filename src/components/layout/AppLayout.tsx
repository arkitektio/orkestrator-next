import { ArkitektLogo } from "@/app/components/logos/ArkitektLogo";
import { Link } from "react-router-dom";
import ShadowRealm from "shadowrealm-api";

export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  
  return (
    <div className="flex flex-col h-screen sm:flex-row ">
      <div className="flex-initial flex  flex-col mt-1 z-10 w-19 shadow shadow-xl">
        <div className="flex-initial h-12 border-b-gray-600 ">
        <Link to={"/"}>
          <ArkitektLogo
            width={"100%"}
            height={"100%"}
            cubeColor={"hsl(var(--secondary))"}
            aColor={"hsl(var(--foreground))"}
            strokeColor={"hsl(var(--foreground))"}
          />
        </Link>
          
          
        </div>
        {navigationBar}
        
        
      </div>
      <div className="flex-grow flex overflow-y-auto z-2 ml-1 my-1 rounded-l rounded-l-md border-1 border-r-0 border">{children}</div>
    </div>
  );
};
