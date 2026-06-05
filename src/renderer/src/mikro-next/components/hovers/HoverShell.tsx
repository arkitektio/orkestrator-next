import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";
import { cn } from "@/lib/utils";
import React from "react";

// Re-export the generic hover chrome so the mikro hover cards can keep
// importing everything they need from a single module.
export {
  HoverRow,
  HoverSectionLabel,
  HoverShell,
  HoverSkeleton,
} from "@/components/hover/HoverShell";

/** A snapshot thumbnail backed by the mikro media layer. */
export const HoverThumb = ({
  media,
  alt,
  className,
}: {
  media: React.ComponentProps<typeof WithMikroMediaUrl>["media"];
  alt: string;
  className?: string;
}) => {
  if (!media) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-[9px] text-muted-foreground",
          className,
        )}
      >
        —
      </div>
    );
  }

  return (
    <WithMikroMediaUrl media={media}>
      {(url) => (
        <img
          src={url}
          alt={alt}
          className={cn("object-cover bg-muted", className)}
        />
      )}
    </WithMikroMediaUrl>
  );
};
