import { ArkitektLogo } from "@/app/components/logos/ArkitektLogo";
import { BackLogo } from "@/app/components/logos/BackLogo";
import { useLocation, useNavigate } from "react-router-dom";

export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    if (window.electron) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex-grow flex flex-col sm:flex-row bg-background  dark:text-white  h-screen">
      <div className="flex-initial md:flex-col mt-1 z-10 md:w-[60px] shadow shadow-xl bg-background hidden md:block">
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
        {navigationBar}
      </div>
      <div className="flex-grow flex overflow-y-auto z-2 ml-1 my-1 rounded  border-1 border border-gray-400  dark:border-gray-700 bg-pane shadow shadow-xs mr-1 ">
        {children}
      </div>
    </div>
  );
};
