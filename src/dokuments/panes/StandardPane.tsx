import { ListRender } from "@/components/layout/ListRender";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { FancyInput } from "@/components/ui/fancy-input";
import { DroppableNavLink } from "@/components/ui/link";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowDown, Home, Image } from "lucide-react";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import PageCard from "../components/cards/PageCard";

export const NavigationPane = () => (
  <div className="flex-1 flex-col">
    <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
      <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
        Explore
      </div>
      <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
        <DroppableNavLink
          to="/lovekit"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DroppableNavLink>
      </div>

      <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
        Streams
      </div>
      <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
        <DroppableNavLink to="/lovekit/streams" className="flex gap-3 w-full hover:text-primary">
          <Image className="h-4 w-4" />
          Streams
        </DroppableNavLink>
      </div>
    </nav>
  </div>
);

const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    pagination: {
      limit: 10,
    },
  };

  const { data, refetch } = useGlobalSearchQuery({ variables });

  React.useEffect(() => {
    refetch(variables);
  }, [debouncedSearch]);

  const searchBar = (
    <div className="w-full flex flex-row">
      <Popover>
        <PopoverAnchor asChild>
          <div className="h-full w-full relative flex flex-row">
            <FancyInput
              placeholder="Search..."
              type="string"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow h-full bg-background text-foreground w-full"
            />
            <PopoverTrigger className="absolute right-1 top-1 text-foreground">
              <ArrowDown />
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent>
          <div className="flex flex-col gap-2">
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <SidebarLayout searchBar={searchBar}>
      {search.trim() === "" ? (
        <NavigationPane />
      ) : (
        <div className="h-full">
          <ListRender array={data?.pages}>
            {(item, i) => <PageCard item={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;