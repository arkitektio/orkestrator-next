import { AsyncSoloBroadcastWidget } from "@/lovekit/widgets/SoloBroadcastWidget";
import { createBlokComponent, useBlok, useValue } from "../../runtime";
import * as z from "zod";
import { LovekitSoloBroadcast } from "@/linkers";

const classNameSchema = z.string().optional();
const streamSchema = z.object({ object: z.string(), __identifier: z.literal(LovekitSoloBroadcast.identifier) }).optional();

export const StreamRenderBlok = createBlokComponent(
  {
    name: "StreamRender",
    schema: z.object({
      broadcast: streamSchema,
      className: classNameSchema,
    }),
  },
  ({ component, schema }) => {
    const blok = useBlok(component, schema);
    const broadcastId = useValue(blok.broadcast);
    const className = useValue(blok.className);

    if (!broadcastId?.object) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 text-sm text-muted-foreground">
          No broadcast selected.
        </div>
      );
    }

    return <AsyncSoloBroadcastWidget id={broadcastId.object} className={className} />;
  },
);

export const lovekitBlokComponents = [StreamRenderBlok];
