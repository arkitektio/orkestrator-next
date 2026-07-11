import { Badge } from "@/components/ui/badge";
import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";
import { Object } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useGetImageQuery } from "../../api/graphql";
import { HoverRow, HoverShell, HoverSkeleton } from "./HoverShell";
import { ImageDisplay } from "../../displays/ImageDisplay";

export const ImageHoverCard = ({ object }: { object: Object }) => {
  // Wait an extra 300ms after the hover card opens before kicking off the
  // expensive live render, so quickly passing over items doesn't overload us.
  const [showLive, setShowLive] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setShowLive(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const { data, error } = useGetImageQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load image details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const image = data.image;
  const snapshot = image.renders.find(
    (
      r,
    ): r is Extract<(typeof image.renders)[number], { __typename?: "Snapshot" }> =>
      r.__typename === "Snapshot",
  );
  const shape = image.store.shape;

  return (
    <HoverShell
      title={image.name}
      subtitle={
        image.dataset ? `in ${image.dataset.name}` : "Image"
      }
      preview={
        <div className="relative h-40 w-full bg-muted overflow-hidden">
          {snapshot ? (
            <WithMikroMediaUrl media={snapshot.store}>
              {(url) => (
                <img
                  src={url}
                  alt={image.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </WithMikroMediaUrl>
          ) : (
            !showLive && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                No preview
              </div>
            )
          )}
          {showLive && (
            <div className="absolute inset-0">
              <ImageDisplay
                identifier="@mikro/image"
                object={image.id}
                context="widget"
              />
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-1">
        {shape.length > 0 && (
          <HoverRow label="Shape" value={shape.join(" × ")} />
        )}
        {image.store.dtype && (
          <HoverRow label="Dtype" value={image.store.dtype} />
        )}
        {image.rois.length > 0 && (
          <HoverRow label="ROIs" value={image.rois.length} />
        )}
        <HoverRow
          label="Created"
          value={
            image.createdAt
              ? formatDistanceToNow(new Date(image.createdAt), {
                  addSuffix: true,
                })
              : "—"
          }
        />
      </div>
      {image.tags.length > 0 && (
        <div className="flex flex-row flex-wrap gap-1 pt-1">
          {image.tags.slice(0, 6).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </HoverShell>
  );
};

export default ImageHoverCard;
