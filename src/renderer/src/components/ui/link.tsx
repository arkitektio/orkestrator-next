import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { useEffect } from "react";
import { useDrop } from "react-dnd";
import {
  LinkProps,
  NavLink,
  NavLinkProps,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

export const Link = ({ to, children }: LinkProps) => {
  return <RouterLink to={to}>{children}</RouterLink>;
};

export const DroppableNavLink = (props: NavLinkProps) => {
  const navigate = useNavigate();

  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log("Dropping item on NavLink", item);
        }
        return {};
      },
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
        };
      },
    };
  }, []);

  useEffect(() => {
    if (isOver) {
      const timeout = setTimeout(() => {
        console.log("Navigating to ", props.to);
        navigate(props.to);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOver]);

  return (
    <div ref={drop} className={`${isOver && "animate-pulse"}`}>
      <NavLink {...props}/>
    </div>
  );
};
