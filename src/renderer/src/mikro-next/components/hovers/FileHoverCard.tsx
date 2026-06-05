import { MikroImage } from "@/linkers";
import { Object } from "@/types";
import { useGetFileQuery } from "../../api/graphql";
import {
  HoverRow,
  HoverSectionLabel,
  HoverShell,
  HoverSkeleton,
  HoverThumb,
} from "./HoverShell";

// Source - https://stackoverflow.com/q/10420352 (CC BY-SA 4.0)
function getReadableFileSizeString(fileSizeInBytes: number) {
  let i = -1;
  const byteUnits = [" kB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
  do {
    fileSizeInBytes /= 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export const FileHoverCard = ({ object }: { object: Object }) => {
  const { data, error } = useGetFileQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load file details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const file = data.file;

  // Images that were created from (parsed out of) this file, via its file views.
  const derivedImages = Array.from(
    new Map(file.views.map((view) => [view.image.id, view.image])).values(),
  ).slice(0, 6);

  return (
    <HoverShell title={file.name} subtitle="File">
      <div className="flex flex-col gap-1">
        <HoverRow
          label="Size"
          value={
            file.size != null ? getReadableFileSizeString(file.size) : "—"
          }
        />
        {file.contentType && (
          <HoverRow label="Type" value={file.contentType} />
        )}
        <HoverRow label="Series" value={file.views.length} />
        {file.origins.length > 0 && (
          <HoverRow label="Origins" value={file.origins.length} />
        )}
        <HoverRow label="Organization" value={file.organization.slug} />
      </div>

      {derivedImages.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <HoverSectionLabel>Images from this file</HoverSectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {derivedImages.map((image) => (
              <MikroImage.DetailLink
                key={image.id}
                object={image}
                className="group/thumb flex flex-col gap-1"
              >
                <HoverThumb
                  media={image.latestSnapshot?.store}
                  alt={image.name}
                  className="h-14 w-full rounded group-hover/thumb:ring-1 group-hover/thumb:ring-primary transition-all"
                />
                <span className="text-[10px] leading-tight line-clamp-1 text-muted-foreground">
                  {image.name}
                </span>
              </MikroImage.DetailLink>
            ))}
          </div>
        </div>
      )}
    </HoverShell>
  );
};

export default FileHoverCard;
