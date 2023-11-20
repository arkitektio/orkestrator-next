import * as React from "react";
import { NavLink } from "react-router-dom";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";

interface IBreadCrumbsProps {}

const BreadCrumbs: React.FunctionComponent<IBreadCrumbsProps> = (props) => {
  const breadcrumbs = useReactRouterBreadcrumbs();

  return (
    <>
      <div className="flex-initial  sm:py-3 py-2">
        {breadcrumbs.map(({ match, breadcrumb }) => (
          <span key={match.pathname}>
            <NavLink
              to={match.pathname}
              className={({ isActive }) =>
                "font-semibold text-md mb-2 cursor-pointer " +
                "text-foreground dark:text-foreground"
              }
            >
              {breadcrumb}
            </NavLink>
            <span className="text-black dark:text-slate-100">{" > "}</span>
          </span>
        ))}
      </div>
    </>
  );
};

export default BreadCrumbs;
