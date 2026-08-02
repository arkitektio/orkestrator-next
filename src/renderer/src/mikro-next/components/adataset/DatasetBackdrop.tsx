import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MikroScene } from "@/linkers";
import { Clapperboard, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  GetADatasetQuery,
  useCreateSceneFromCoordinateSystemMutation,
  useGetCoordinateGraphQuery,
} from "../../api/graphql";
import { datasetRegistrations } from "../coordinates/registrations";

type PageDataset = GetADatasetQuery["adataset"];

/**
 * The spaces this dataset's grid is registered into — the worlds a scene could
 * be composed over besides the dataset's own pixels. Depth 1: the immediate
 * registrations are the offer; anything further is a space the dataset reaches
 * THROUGH another, which the bootstrap resolves on its own.
 *
 * One small round trip, shared through the Apollo cache by both callers on the
 * page (the backdrop and the header button), so mounting them together costs
 * one request, not two.
 */
const useDatasetWorlds = (dataset: PageDataset) => {
  const gridId = dataset.intrinsicSystem?.id;
  const { data } = useGetCoordinateGraphQuery({
    variables: { coordinateSystem: gridId as string, maxDepth: 1 },
    skip: !gridId,
  });

  return datasetRegistrations(
    gridId,
    data?.coordinateGraph.systems ?? [],
    data?.coordinateGraph.transformations ?? [],
  );
};

/**
 * Create a scene for this dataset.
 *
 * A scene is always built over a coordinate SYSTEM — there is no
 * `createSceneFromDataset` any more — so the only question is which space, and
 * the dataset's own pixel grid is simply the default answer. Over the grid the
 * dataset's own data becomes the layer; over a stage frame or a µm calibration
 * it is placed THERE, at physical scale and alongside whatever else registered
 * into that space, which is a different picture of the same data.
 *
 * So the menu appears only when there is a choice to make: with nothing but its
 * own grid, this is one button and one click.
 */
export const CreateSceneControl = ({
  dataset,
  size = "default",
  variant = "default",
}: {
  dataset: PageDataset;
  size?: "default" | "sm";
  /** "outline" for the header, where this is a secondary way to add a scene. */
  variant?: "default" | "outline";
}) => {
  const navigate = useNavigate();
  const worlds = useDatasetWorlds(dataset);
  const grid = dataset.intrinsicSystem;

  const [createScene, { loading }] = useCreateSceneFromCoordinateSystemMutation({
    onCompleted: (result) => navigate(MikroScene.linkBuilder(result.createSceneFromCoordinateSystem.id)),
  });
  const stage = (coordinateSystem: string) =>
    createScene({ variables: { input: { coordinateSystem } } });

  const label = loading ? "Creating scene…" : "Create scene";

  // No grid means the dataset has no space of its own yet, so there is nothing
  // to build over and nothing for a registration to have left from either.
  if (!grid) return null;

  if (worlds.length === 0) {
    return (
      <Button
        size={size}
        variant={variant}
        disabled={loading}
        onClick={() => stage(grid.id)}
      >
        <Clapperboard className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} variant={variant} disabled={loading}>
          <Clapperboard className="mr-2 h-4 w-4" />
          {label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel>Compose it in</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => stage(grid.id)}>
          Its own pixel grid
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Registered spaces</DropdownMenuLabel>
        {worlds.map(({ system }) => (
          <DropdownMenuItem key={system.id} onSelect={() => stage(system.id)}>
            <span className="truncate">{system.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * What the page shows where the renderer would be, when the dataset is in no
 * scene yet: what this data IS, and the one action that follows from it.
 *
 * Deliberately short. The details — every pyramid level, every axis unit, the
 * placement graph — have their own pages and their own panel; repeating them
 * here would bury the sentence that actually matters, which is that there is
 * nothing to render until someone composes a scene.
 */
export const DatasetBackdrop = ({ dataset }: { dataset: PageDataset }) => {
  const worlds = useDatasetWorlds(dataset);
  const axes = dataset.intrinsicSystem?.axes ?? [];

  // Axis names over the shape, paired by position: "z × y × x" over
  // "64 × 2048 × 2048" reads as one fact where two lists would not.
  const dimensions = dataset.axisNames
    .map((name, index) => `${name} ${dataset.shape[index] ?? "?"}`)
    .join("  ·  ");

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold">{dataset.name}</h2>
          <div className="font-mono text-xs text-muted-foreground">{dimensions}</div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {dataset.multiscale && (
              <Badge variant="outline" className="text-[0.625rem]">
                {dataset.dataArrays.length} levels
              </Badge>
            )}
            {axes.length > 0 && (
              <Badge variant="outline" className="text-[0.625rem]">
                {axes.length}D
              </Badge>
            )}
            {worlds.length > 0 && (
              <Badge variant="outline" className="text-[0.625rem]">
                registered in {worlds.length}{" "}
                {worlds.length === 1 ? "space" : "spaces"}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Not rendered in any scene yet. A scene composes it into a world, which
          is what the viewer draws.
        </p>

        <CreateSceneControl dataset={dataset} />
      </div>
    </div>
  );
};
