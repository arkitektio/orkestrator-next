import { Badge } from "@/components/ui/badge";
import { MikroCoordinateSystem } from "@/linkers";
import { GetADatasetQuery } from "../../api/graphql";
import { baseDtypeOf, formatShape } from "../../specs";

type PageDataset = GetADatasetQuery["adataset"];

/**
 * What the dataset *is*, in full — the detail that used to crowd the scene
 * overlay. Reading it is a deliberate act now: the page itself only announces the
 * name and the shape, and anyone who wants the levels or the space they are
 * indexed in opens this tab.
 *
 * Takes the dataset the page already fetched rather than querying again — every
 * field here is on the `ADataset` fragment `GetADataset` selects.
 */
export const DatasetInfoSidebar = ({ dataset }: { dataset: PageDataset }) => {
  const dtype = baseDtypeOf(dataset.dataArrays);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{dataset.name}</h2>
        {dataset.description && (
          <p className="text-sm text-muted-foreground">{dataset.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold">Shape</div>
        <div className="font-mono text-xs text-muted-foreground">
          {formatShape(dataset.axisNames, dataset.shape)}
        </div>
        {dtype && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Dtype</span>
            <span className="font-mono text-xs">{dtype}</span>
          </div>
        )}
        {dataset.multiscale && (
          <div>
            <Badge variant="outline" className="text-[0.625rem]">
              multiscale
            </Badge>
          </div>
        )}
      </div>

      {dataset.intrinsicSystem && (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold">Intrinsic system</div>
          <MikroCoordinateSystem.DetailLink
            object={dataset.intrinsicSystem}
            className="truncate text-xs"
          >
            {dataset.intrinsicSystem.name}
          </MikroCoordinateSystem.DetailLink>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold">Data arrays</div>
        {/* Spread before sorting: Apollo freezes the array it hands back. */}
        {[...dataset.dataArrays]
          .sort((a, b) => a.level - b.level)
          .map((array) => (
            <div
              key={array.id}
              className="flex flex-row gap-2 font-mono text-[0.625rem]"
            >
              <span className="text-muted-foreground">L{array.level}</span>
              <span>{array.shape.join(" × ")}</span>
              <span className="text-muted-foreground">
                / {array.chunkShape.join(" × ")}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
