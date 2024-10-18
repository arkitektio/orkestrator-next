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
  MikroProtocolStep,
  MikroROI,
} from "@/linkers";
import Timestamp from "react-timestamp";
import { ImageRGBD, RoiRGBD } from "../components/render/TwoDThree";
import CreateEntityMetricForm from "../forms/CreateEntityMetricForm";
import RecordProtocolStepForm from "../forms/RecordProtocolStepForm";

export default asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  return (
    <MikroEntity.ModelPage
      title={data.entity.label}
      object={data.entity.id}
      pageActions={
        <div className="flex flex-row gap-2">
          <MikroEntity.DetailLink object={data.entity.id} subroute="graph">
            <Button variant="outline" size="sm">
              Graph
            </Button>
          </MikroEntity.DetailLink>
          <FormDialog
            trigger={
              <Button variant="outline" size="sm">
                Record
              </Button>
            }
          >
            <RecordProtocolStepForm entity={data.entity} />
          </FormDialog>
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
      <div className="w-full h-full">
        <MikroEntity.DetailLink object={data.entity.id}>
          {data?.entity?.linkedExpression.expression.label}
        </MikroEntity.DetailLink>

        <div className="font-bold text-xl"> Marked as ROI in </div>
        <div className="grid grid-cols-2 gap-2">
          {data?.entity?.rois.map((roi, i) => (
            <MikroROI.DetailLink
              object={roi.id}
              className={"p-2 truncate w-[200px] h-[200px] border-0 "}
            >
              <RoiRGBD roi={roi} />
            </MikroROI.DetailLink>
          ))}
        </div>

        <div className="font-bold text-xl"> Is Specimen of </div>
        <div className="grid grid-cols-2 gap-2">
          {data?.entity?.specimenViews.map((spec, i) => (
            <Card className="p-2 truncate">
              <MikroImage.DetailLink
                object={spec.image.id}
                className={"max-w-[80px] truncate "}
              >
                <ImageRGBD image={spec.image} />
              </MikroImage.DetailLink>
            </Card>
          ))}
        </div>

        <div className="font-bold text-xl"> Measurements </div>
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

        <div className="font-bold text-xl"> Was subjected to</div>

        <Timeline className="w-full">
          {data?.entity?.subjectedTo.map((e) => (
            <TimelineItem className="w-full">
              <TimelineConnector />
              <TimelineHeader>
                <TimelineTime>
                  <Timestamp date={e.performedAt} />
                </TimelineTime>
                <TimelineIcon />
                <TimelineTitle>{e.name} </TimelineTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineDescription>
                  {e.usedReagent?.label}
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <div className="grid grid-cols-2 gap-2">
          {data?.entity?.subjectedTo.map((sub, i) => (
            <Card className="p-2 truncate">
              <MikroProtocolStep.DetailLink
                object={sub.id}
                className={"max-w-[80px] truncate "}
              >
                {sub.id}
                {sub.name}
              </MikroProtocolStep.DetailLink>
            </Card>
          ))}
        </div>

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
    </MikroEntity.ModelPage>
  );
});
