import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import * as React from "react";
import { NavLink } from "react-router-dom";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";

interface IBreadCrumbsProps { }

const BreadCrumbs: React.FunctionComponent<IBreadCrumbsProps> = (props) => {
  const breadcrumbs = useReactRouterBreadcrumbs();

  return (
    <>
      <Breadcrumb className="flex-initial">
        <BreadcrumbList>
          {breadcrumbs.slice(0, -1).map(({ match, breadcrumb }) => (
            <>
              <BreadcrumbItem key={match.pathname}>
                <BreadcrumbLink asChild>
                  <NavLink to={match.pathname}>{breadcrumb}</NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>
              {breadcrumbs[breadcrumbs.length - 1].breadcrumb}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadCrumbs;
