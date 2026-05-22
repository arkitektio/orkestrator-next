import { DroppableNavLink } from "@/components/ui/link";
import { Home, Image } from "lucide-react";
import { exp } from "three/src/nodes/math/MathNode.js";

interface IDataSidebarProps { }

export const NavigationPane = (props: {}) => {
  return (
    <div className="flex-1 flex-col">
      <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Explore
        </div>̉
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
          <DroppableNavLink
            to="/blok"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </DroppableNavLink>
        </div>

        <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
          Bloks
        </div>
        <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
          <DroppableNavLink
            to="/blok/dashboards"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Image className="h-4 w-4" />
            Dashboards
          </DroppableNavLink>
          <DroppableNavLink
            to="/blok/bloks"
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <Image className="h-4 w-4" />
            Bloks
          </DroppableNavLink>
        </div>
      </nav>
    </div>
  );
};

export default NavigationPane;
