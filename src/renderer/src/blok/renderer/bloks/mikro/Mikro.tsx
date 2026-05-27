import { cn } from "@/lib/utils";
import { ImageDisplay } from "@/mikro-next/displays/ImageDisplay";
import * as z from "zod";
import { createBlokComponent, useBlok, useValue } from "../../runtime";
import { MikroImage } from "@/linkers";

const classNameSchema = z.string().optional();
const emptyTextSchema = z.string().optional();
const mikroImageSchema = z.object({ object: z.string(), __identifier: z.literal(MikroImage.identifier) }).optional();



export const MikroImageBlok = createBlokComponent(
  {
    name: "MikroImage",
    schema: z.object({
      image: mikroImageSchema,
      className: classNameSchema,
      emptyText: emptyTextSchema,
    }),
  },
  ({ component, schema }) => {
    const blok = useBlok(component, schema);
    const imageValue = useValue(blok.image);
    const className = useValue(blok.className);
    const emptyText = useValue(blok.emptyText);



    if (!imageValue?.object) {
      return (
        <div
          className={cn(
            "flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 text-sm text-muted-foreground",
            className,
          )}
        >
          {emptyText ?? "No image available."}
        </div>
      );
    }

    return (
      <div
        className={cn(
          "min-h-40 overflow-hidden rounded-xl border border-border/60 bg-background/70",
          className,
        )}
      >
        <ImageDisplay identifier="@mikro/image" object={imageValue?.object} context="widget" />
      </div>
    );
  },
);

export const mikroBlokComponents = [MikroImageBlok];
