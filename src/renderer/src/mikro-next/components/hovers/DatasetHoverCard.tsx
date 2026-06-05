import { Badge } from "@/components/ui/badge";
import { MikroFile, MikroImage } from "@/linkers";
import { Object } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FileIcon } from "lucide-react";
import { useGetDatasetQuery } from "../../api/graphql";
import {
  HoverRow,
  HoverSectionLabel,
  HoverShell,
  HoverSkeleton,
  HoverThumb,
} from "./HoverShell";

export const DatasetHoverCard = ({ object }: { object: Object }) => {
  const { data, error } = useGetDatasetQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load dataset details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const dataset = data.dataset;

  // Build a combined list of up to 6 items contained in the dataset, images first.
  const items = [
    ...dataset.images.map((image) => ({ type: "image" as const, image })),
    ...dataset.files.map((file) => ({ type: "file" as const, file })),
  ].slice(0, 6);

  return (
    <HoverShell
      title={dataset.name}
      subtitle={dataset.isDefault ? "Default dataset" : "Dataset"}
    >
      {dataset.description && (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {dataset.description}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <HoverRow label="Images" value={dataset.images.length} />
        <HoverRow label="Files" value={dataset.files.length} />
        {dataset.children.length > 0 && (
          <HoverRow label="Sub-datasets" value={dataset.children.length} />
        )}
        <HoverRow
          label="Created"
          value={
            dataset.createdAt
              ? formatDistanceToNow(new Date(dataset.createdAt), {
                  addSuffix: true,
                })
              : "—"
          }
        />
      </div>
      {items.length > 0 && (
        <div className="flex flex-col gap-1">
          <HoverSectionLabel>Contains</HoverSectionLabel>
          <div className="flex flex-col gap-0.5">
            {items.map((item) =>
              item.type === "image" ? (
                <MikroImage.DetailLink
                  key={`image-${item.image.id}`}
                  object={item.image}
                  className="flex flex-row items-center gap-2 rounded px-1 py-0.5 hover:bg-muted transition-colors"
                >
                  <HoverThumb
                    media={item.image.latestSnapshot?.store}
                    alt={item.image.name}
                    className="h-6 w-6 rounded shrink-0"
                  />
                  <span className="text-xs line-clamp-1">
                    {item.image.name}
                  </span>
                </MikroImage.DetailLink>
              ) : (
                <MikroFile.DetailLink
                  key={`file-${item.file.id}`}
                  object={item.file}
                  className="flex flex-row items-center gap-2 rounded px-1 py-0.5 hover:bg-muted transition-colors"
                >
                  <div className="h-6 w-6 rounded shrink-0 bg-muted flex items-center justify-center">
                    <FileIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs line-clamp-1">{item.file.name}</span>
                </MikroFile.DetailLink>
              ),
            )}
          </div>
        </div>
      )}

      {dataset.tags.length > 0 && (
        <div className="flex flex-row flex-wrap gap-1 pt-1">
          {dataset.tags.slice(0, 6).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </HoverShell>
  );
};

export default DatasetHoverCard;
