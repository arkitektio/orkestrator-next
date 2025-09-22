import { useMeQuery } from "@/lok-next/api/graphql";
import { NavLink, useLocation } from "react-router-dom";

export const NotFound = () => {
  const { data } = useMeQuery({
    fetchPolicy: "cache-and-network",
  });

  const location = useLocation();

  return (
    <div className="flex flex-col w-full h-full flex items-center justify-center">
      <div className="flex flex-col">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            Hi {data?.me?.username || "Stranger"} :)
          </h1>
          <h2 className="text-xl font-light tracking-tighter sm:text-2xl md:text-3xl text-foreground">
            This route does not exist
          </h2>
          <h3 className="text-2xl font-light tracking-tighter sm:text-3xl md:text-4xl text-foreground">
            {location.pathname}
          </h3>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Try another one
          </p>
        </div>

        <NavLink
          to="/"
          className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark"
        >
          Go Home
        </NavLink>

        <div className="flex flex-col gap-2 min-[400px]:flex-row"></div>
      </div>
    </div>
  );
};
