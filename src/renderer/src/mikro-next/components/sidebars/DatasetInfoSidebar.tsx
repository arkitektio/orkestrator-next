import { Badge } from "@/components/ui/badge";
import { MikroCoordinateSystem } from "@/linkers";
import { GetADatasetQuery, useGetADatasetDerivedQuery } from "../../api/graphql";
import {
  ADATASET_SPEC_INFO,
  baseDtypeOf,
  formatShape,
} from "../../specs";
import { DatasetCalibrationSection } from "./DatasetCalibrationSection";
import { DerivedDatasetsSection } from "./DerivedDatasetsSection";
import { DerivedFromSection } from "./DerivedFromSection";
import { ProvenanceSection } from "./ProvenanceSection";

type PageDataset = GetADatasetQuery["adataset"];

/**
 * Everything about the dataset that is not the picture: what it IS, where it
 * came from, what came out of it, and how it has been edited since.
 *
 * The four read as one story, which is why they are one tab rather than a tab
 * each — a lineage split across two rails is a lineage nobody follows. The
 * static facts come from the page's own query; the lineage and the history are
 * one extra round trip made here, because the tab is unmounted while inactive
 * (Radix `TabsContent`) and so costs nothing until someone opens it.
 */
export const DatasetInfoSidebar = ({ dataset }: { dataset: PageDataset }) => {
  const dtype = baseDtypeOf(dataset.dataArrays);

  // cache-and-network so reopening the tab after a task ran shows what it
  // produced rather than the answer from before it started.
  const { data, error, loading } = useGetADatasetDerivedQuery({
    variables: { id: dataset.id },
    fetchPolicy: "cache-and-network",
  });

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
            {/* Carries the DEPTH, not just the fact: it is what survives of the
                per-level listing this panel used to end with. */}
            <Badge variant="outline" className="text-[0.625rem]">
              multiscale · {dataset.dataArrays.length} levels
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

      {/* What the dataset structurally IS, in place of the per-level array
          listing that used to sit here: the levels are the same array at
          different resolutions, so listing every one said a single fact many
          times over. Their count moved onto the multiscale badge above. */}
      {dataset.spec.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold">Tags</div>
          <div className="flex flex-row flex-wrap gap-1">
            {dataset.spec.map((spec) => {
              const entry = ADATASET_SPEC_INFO[spec];
              if (!entry) return null;
              const Icon = entry.icon;
              return (
                <Badge
                  key={spec}
                  variant="secondary"
                  className="gap-1 px-1.5 py-0 text-[0.625rem] font-normal"
                  title={entry.description}
                >
                  <Icon className="h-3 w-3" />
                  {entry.short}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <DatasetCalibrationSection dataset={dataset} />

      {/* Lineage and history. One failure message for all three: they come from
          one query, so a partial rendering would be a lie about which part is
          missing. */}
      {error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">
            Could not load lineage: {error.message}
          </p>
        </div>
      ) : !data ? (
        <div className="text-xs text-muted-foreground">
          {loading ? "Loading lineage…" : null}
        </div>
      ) : (
        <>
          <DerivedFromSection edges={data.adataset.derivedFrom} />

          <DerivedDatasetsSection
            intrinsicSystem={data.adataset.intrinsicSystem}
            lenses={data.lenses}
            derived={data.adataset.derivedDatasets}
          />

          <ProvenanceSection entries={data.adataset.provenanceEntries} />
        </>
      )}
    </div>
  );
};
