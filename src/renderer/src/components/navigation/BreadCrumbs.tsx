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

const BreadCrumbs: React.FunctionComponent<IBreadCrumbsProps> = () => {
  const breadcrumbs = useReactRouterBreadcrumbs();

  return (
    <>
      <Breadcrumb className="flex-initial text-md">
        <BreadcrumbList>
          {breadcrumbs.slice(0, -1).map(({ match, breadcrumb }) => (
            <React.Fragment key={match.pathname}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <NavLink to={match.pathname}>{breadcrumb}</NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
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
