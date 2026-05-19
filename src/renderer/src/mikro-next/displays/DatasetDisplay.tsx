import { DisplayWidgetProps } from "@/lib/display/registry";
import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";
import { MikroDataset } from "@/linkers";
import { useGetDatasetQuery } from "@/mikro-next/api/graphql";

export const DatasetDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetDatasetQuery({
    variables: {
      id: props.object,
    },
  });

  if (!data?.dataset) {
    return <div className="text-xs text-muted-foreground">Dataset not found</div>;
  }

  const dataset = data.dataset;

  if (props.context === "command") {
    const imageCount = dataset.images?.length ?? 0;
    const fileCount = dataset.files?.length ?? 0;
    const childCount = dataset.children?.length ?? 0;
    return (
      <MikroDataset.DetailLink object={dataset}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{dataset.name}</span>
          {imageCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {imageCount} {imageCount === 1 ? "image" : "images"}
            </span>
          )}
          {fileCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {fileCount} {fileCount === 1 ? "file" : "files"}
            </span>
          )}
          {childCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {childCount} sub-datasets
            </span>
          )}
        </div>
      </MikroDataset.DetailLink>
    );
  }

  const imageCount = dataset.images?.length ?? 0;
  const fileCount = dataset.files?.length ?? 0;
  const thumbnails = dataset.images?.slice(0, 4) ?? [];

  return (
    <MikroDataset.DetailLink object={dataset}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{dataset.name}</div>
            {dataset.description && (
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {dataset.description}
              </div>
            )}
          </div>
          {dataset.isDefault && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
              Default
            </span>
          )}
        </div>

        {thumbnails.length > 0 && (
          <div className="grid grid-cols-4 gap-1">
            {thumbnails.map((img) =>
              img.latestSnapshot?.store ? (
                <WithMikroMediaUrl key={img.id} media={img.latestSnapshot.store}>
                  {(url) => (
                    <img
                      src={url}
                      alt={img.name}
                      className="aspect-square w-full object-cover rounded"
                    />
                  )}
                </WithMikroMediaUrl>
              ) : (
                <div
                  key={img.id}
                  className="aspect-square w-full bg-muted rounded flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground truncate px-1">
                    {img.name}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        <div className="flex gap-3 text-xs text-muted-foreground">
          {imageCount > 0 && (
            <span>{imageCount} {imageCount === 1 ? "image" : "images"}</span>
          )}
          {fileCount > 0 && (
            <span>{fileCount} {fileCount === 1 ? "file" : "files"}</span>
          )}
          {dataset.children && dataset.children.length > 0 && (
            <span>{dataset.children.length} sub-datasets</span>
          )}
        </div>
      </div>
    </MikroDataset.DetailLink>
  );
};
