import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetEntityQuery } from "../api/graphql";

import { FormDialog } from "@/components/dialog/FormDialog";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MikroEntity,
  MikroEntityMetric,
  MikroEntityRelation,
  MikroImage,
  MikroLinkedExpression,
  MikroProtocolStep,
  MikroROI,
} from "@/linkers";
import Timestamp from "react-timestamp";
import { ImageRGBD, RoiRGBD } from "../components/render/TwoDThree";
import CreateEntityMetricForm from "../forms/CreateEntityMetricForm";
import { PlateDisplay } from "./ProtocolStepTemplatePage";
import { Separator } from "@/components/ui/separator";
import { PerformStepButton } from "../overlays/EntitySidebar";

export default asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  return (
    <MikroEntity.ModelPage
      title={data.entity.label}
      object={data.entity.id}
      pageActions={
        <div className="flex flex-row gap-2">
          <MikroEntity.DetailLink object={data.entity.id} subroute="graph">
            <Button variant="outline" size="sm">
              Open in Graph
            </Button>
          </MikroEntity.DetailLink>
          <FormDialog
            trigger={
              <Button variant="outline" size="sm">
                Measure
              </Button>
            }
          >
            <CreateEntityMetricForm entity={data.entity} />
          </FormDialog>
        </div>
      }
    >
      <div className="w-full h-full p-3">
        <div className="flex flex-col gap-1 mb-3">
          <MikroEntity.DetailLink
            object={data.entity.id}
            className={"text-3xl"}
          >
            {data?.entity?.label}
          </MikroEntity.DetailLink>
          {data?.entity?.linkedExpression && (
            <MikroLinkedExpression.DetailLink
              object={data.entity.linkedExpression.id}
              className="text-md text-muted-foreground"
            >
              {data?.entity?.linkedExpression.label}
            </MikroLinkedExpression.DetailLink>
          )}
        </div>

        <div className="flex flex-row w-full gap-2">
          <div className="flex-1 flex flex-col gap-2 h-full">
            <div className="font-bold text-xl"> Measurements </div>
            <div className="flex flex-col gap-2">
              {data?.entity?.rois.map((roi, i) => (
                <Card className=" truncate h-[200px]">
                  <MikroROI.DetailLink
                    object={roi.id}
                    className={"p-2 truncate h-[200px] border-0 "}
                  >
                    <RoiRGBD roi={roi} />
                  </MikroROI.DetailLink>
                </Card>
              ))}
              {data?.entity?.specimenViews.map((spec, i) => (
                <Card className=" truncate h-[200px]">
                  <MikroImage.DetailLink
                    object={spec.image.id}
                    className={"truncate "}
                  >
                    <ImageRGBD image={spec.image} />
                  </MikroImage.DetailLink>
                </Card>
              ))}
            </div>
          </div>
          <Separator orientation="vertical" className="my-2" />
          <div className="flex-1 flex flex-col gap-2 h-full">
            <div className="font-bold text-xl"> Metrics </div>
            <div className="grid grid-cols-2 gap-2">
              {data?.entity?.metrics.map((spec, i) => (
                <Card className="p-2 truncate" key={i}>
                  <MikroEntityMetric.DetailLink
                    object={spec.id}
                    className={"max-w-[80px] truncate "}
                  >
                    {spec.linkedExpression.label} : {spec.value}
                  </MikroEntityMetric.DetailLink>
                </Card>
              ))}
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="my-2 border-slate-900 border-1 mx-2"
          />
          <div className="flex-1 flex flex-col gap-2 h-full w-full">
            <div className="font-bold text-xl"> Protocol Steps</div>

            <Timeline className="w-full p-2 flex-grow">
              {data?.entity?.subjectedTo.map((e) => (
                <TimelineItem className="w-full">
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon />
                    <TimelineTitle>{e.name}</TimelineTitle>
                  </TimelineHeader>
                  <TimelineContent>
                    <TimelineDescription>
                      <p className="text-xs mb-1">
                        <Timestamp date={e.performedAt} />
                      </p>
                      {e.name}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <div className="p-2 truncate text-center w-full flex-initial mt-3">
              <PerformStepButton entity={data.entity.id} refetch={refetch} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 h-full">
            <div className="font-bold text-xl"> Relates to</div>
            <div className="grid grid-cols-2 gap-2">
              {data?.entity?.relations.map((rel, i) => (
                <Card className="p-2 truncate">
                  <MikroEntityRelation.DetailLink
                    object={rel.id}
                    className={"max-w-[80px] truncate "}
                  >
                    {rel.right.label}
                  </MikroEntityRelation.DetailLink>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MikroEntity.ModelPage>
  );
});
