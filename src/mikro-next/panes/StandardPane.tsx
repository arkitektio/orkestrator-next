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
import { Toggle } from "@/components/ui/toggle";
import { CubeIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowDown, File, Folder, Home, Image } from "lucide-react";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchQuery,
} from "../api/graphql";
import DatasetCard from "../components/cards/DatasetCard";
import FileCard from "../components/cards/FileCard";
import ImageCard from "../components/cards/ImageCard";

export const NavigationPane = () => (
  <div className="flex-1 flex-col">
    <nav className="grid items-start px-1 text-sm font-medium lg:px-2">
      <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
        Explore
      </div>
      <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-4">
        <DroppableNavLink
          to="/mikro"
          className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </DroppableNavLink>
      </div>

      <div className="text-muted-foreground text-xs font-semibold uppercase mb-4">
        Data
      </div>
      <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground mb-5">
        <DroppableNavLink to="/mikro/images" className="flex gap-3 w-full hover:text-primary">
          <Image className="h-4 w-4" />
          Images
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/tables" className="flex gap-3 w-full hover:text-primary">
          <Home className="h-4 w-4" />
          Tables
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/stages" className="flex gap-3 w-full hover:text-primary">
          <CubeIcon className="h-4 w-4" />
          Stages
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/meshes" className="flex gap-3 w-full hover:text-primary">
          <CubeIcon className="h-4 w-4" />
          Meshes
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/rois" className="flex gap-3 w-full hover:text-primary">
          <CubeIcon className="h-4 w-4" />
          Rois
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/datasets" className="flex gap-3 w-full hover:text-primary">
          <Folder className="h-4 w-4" />
          Datasets
        </DroppableNavLink>
        <DroppableNavLink to="/mikro/files" className="flex gap-3 w-full hover:text-primary">
          <File className="h-4 w-4" />
          Files
        </DroppableNavLink>
      </div>
    </nav>
  </div>
);

const Pane: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState("");
  const [noImages, setNoImages] = React.useState(false);
  const [noFiles, setNoFiles] = React.useState(false);
  const [noDatasets, setNoDatasets] = React.useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const variables: GlobalSearchQueryVariables = {
    search: debouncedSearch,
    noImages,
    noFiles,
    noDatasets,
    pagination: {
      limit: 10,
    },
  };

  const { data, refetch } = useGlobalSearchQuery({ variables });

  React.useEffect(() => {
    refetch(variables);
  }, [debouncedSearch, noImages, noFiles]);

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
            <Toggle
              label="No Images"
              name="noImages"
              checked={noImages}
              onCheckedChange={setNoImages}
            >
              Exclude Images
            </Toggle>
            <Toggle
              label="No Files"
              name="noFiles"
              checked={noFiles}
              onCheckedChange={setNoFiles}
            >
              Exclude Files
            </Toggle>
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
          <ListRender array={data?.images}>
            {(item, i) => <ImageCard image={item} key={i} />}
          </ListRender>
          <ListRender array={data?.files}>
            {(item, i) => <FileCard file={item} key={i} />}
          </ListRender>
          <ListRender array={data?.datasets}>
            {(item, i) => <DatasetCard dataset={item} key={i} />}
          </ListRender>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Pane;