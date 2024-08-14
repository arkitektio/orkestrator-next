import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { Badge } from "@/components/ui/badge";
import { MikroImage, MikroProtocolStep } from "@/linkers";
import { useGetProtocolStepQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(useGetProtocolStepQuery, ({ data }) => {
  return (
    <MikroProtocolStep.ModelPage
      title={data?.protocolStep?.name}
      object={data.protocolStep.id}
      actions={<MikroProtocolStep.Actions object={data.protocolStep.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <MikroProtocolStep.Komments object={data.protocolStep.id} />
            ),
          }}
        />
      }
    >
      <div>
        <div className="text-muted-foreground text-sm my-2">
          {data.protocolStep.description}
        </div>
        <Timeline className="w-full">
          {data?.protocolStep?.mappings.map((e) => (
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon />
                <TimelineTitle>
                  {e.protocol.name}{" "}
                  <i className="text-muted-foreground mr-2"> t = {e.t} </i>
                </TimelineTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineDescription>{e.t}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <div className="flex flex-col mt-1">
          {data.protocolStep?.reagents.map((reagent) => (
            <Badge className="flex flex-row ">
              <div className="flex-1 mr-1">{reagent.name}</div>
              {reagent.metrics.map((m) => (
                <Badge className="bg-black text-white">
                  {m.metric.kind.label}:{m.value}
                </Badge>
              ))}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col">
          {data.protocolStep?.views?.map((view) => (
            <div className="flex flex-row">
              <MikroImage.DetailLink object={view.image.id} className="flex-1">
                {view.image.name}
              </MikroImage.DetailLink>
            </div>
          ))}
        </div>
      </div>
    </MikroProtocolStep.ModelPage>
  );
});
