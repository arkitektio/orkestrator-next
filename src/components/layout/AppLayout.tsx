import { useLocation, useNavigate } from "react-router-dom";
import { NavigationMenu } from "../ui/navigation-menu";

export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-background dark:text-white h-screen">
      {/* Desktop navigation - sidebar on the left */}
      <div className="flex-initial md:flex-col mt-1 z-10 md:w-[60px] shadow shadow-xl bg-background hidden md:block">
        <NavigationMenu
          className="px-1 h-full sm:flex-col flex-row w-16 overflow-hidden py-3 flex"
          orientation="vertical"
        >

          {navigationBar}
        </NavigationMenu>
      </div>

      {/* Main content area */}
      <div className="flex-grow flex overflow-y-auto z-2 md:ml-1 md:my-1 my-1 mx-1  md:mb-1 rounded border-1 border border-gray-400 dark:border-gray-700 bg-pane shadow shadow-xs md:mr-1">
        {children}
      </div>

      {/* Mobile navigation - bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-gray-400 dark:border-gray-700 shadow-lg md:hidden">
        <NavigationMenu
          className="px-1 w-full flex-row  h-16 overflow-hidden py-3 flex"
          orientation="horizontal"
        >

          {navigationBar}
        </NavigationMenu>
      </div>
    </div>
  );
};
