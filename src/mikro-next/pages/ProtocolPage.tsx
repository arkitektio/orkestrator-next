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
import { MikroExperiment, MikroImage, MikroProtocol } from "@/linkers";
import { useGetProtocolQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(useGetProtocolQuery, ({ data }) => {
  return (
    <MikroProtocol.ModelPage
      title={data?.protocol?.name}
      object={data.protocol.id}
      actions={<MikroProtocol.Actions object={data.protocol.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroExperiment.Komments object={data.protocol.id} />,
          }}
        />
      }
    >
      <div>
        <div className="text-muted-foreground text-sm my-2">
          {data.protocol.description}
        </div>
        <Timeline className="w-full">
          {data?.protocol.steps.map((e) => (
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon />
                <TimelineTitle>
                  {e.kind.label}{" "}
                  <i className="text-muted-foreground mr-2"> t = {e.t} </i>
                </TimelineTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineDescription>{e.description}</TimelineDescription>

                <div className="flex flex-col mt-1">
                  {e.reagents.map((reagent) => (
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
                  {e.views.map((view) => (
                    <div className="flex flex-row">
                      <MikroImage.DetailLink
                        object={view.image.id}
                        className="flex-1"
                      >
                        {view.image.name}
                      </MikroImage.DetailLink>
                    </div>
                  ))}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </MikroProtocol.ModelPage>
  );
});
