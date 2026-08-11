import { useRegisterDashboardWidget } from "../hooks";
import { Boxes, Loader2 } from "lucide-react";
import {
  useGetADatasetsQuery,
  Ordering,
} from "@/mikro-next/api/graphql";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroADataset } from "@/linkers";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { Card } from "@/components/ui/card";

const LatestADatasetsWidget = () => {
  const resolve = useResolve();
  const { data, loading } = useGetADatasetsQuery({
    variables: {
      pagination: { limit: 8 },
      ordering: [{ createdAt: Ordering.Desc }],
    },
    fetchPolicy: "cache-and-network",
  });

  const datasets = data?.adatasets ?? [];

  return (
    <div className="flex flex-col h-full">
      {loading && datasets.length === 0 ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : datasets.length === 0 ? (
        <p className="text-xs text-muted-foreground">No datasets yet</p>
      ) : (
        <ResponsiveContainerGrid className="[&>*:first-child]:@lg:col-span-2 [&>*:first-child]:@lg:row-span-2">
            {datasets.map((dataset) => (
              <MikroADataset.Smart key={dataset.id} object={dataset}>
                <MikroADataset.DetailLink
                  object={dataset}
                  className={() => "block cursor-pointer group"}
                >
                  <Card className="relative aspect-square rounded-md overflow-hidden bg-muted h-full">
                    {dataset.latestSnapshot?.store.key ? (
                      <Image
                        src={resolve(dataset.latestSnapshot.store.key)}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Boxes className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white truncate">
                        {dataset.name}
                      </p>
                    </div>
                  </Card>
                </MikroADataset.DetailLink>
              </MikroADataset.Smart>
            ))}
        </ResponsiveContainerGrid>
      )}
    </div>
  );
};

export const LatestADatasetsDashboardWidget = () => {
  useRegisterDashboardWidget({
    key: "latest-adatasets",
    label: "Latest Datasets",
    module: "mikro",
    icon: <Boxes className="w-3 h-3" />,
    component: () => <LatestADatasetsWidget />,
    defaultSize: "2x2",
    defaultWidth: 50,
    defaultHeight: 100,
  });

  return null;
};
