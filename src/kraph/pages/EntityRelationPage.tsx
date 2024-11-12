import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetEntityQuery, useGetEntityRelationQuery } from "../api/graphql";

import { FormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  KraphEntity,
  MikroEntityMetric,
  MikroEntityRelation,
  MikroEntityRelationMetric,
  MikroImage,
  KraphProtocolStep,
  MikroROI,
} from "@/linkers";
import { ImageRGBD, RoiRGBD } from "../components/render/TwoDThree";
import CreateEntityMetricForm from "../forms/CreateEntityMetricForm";

export default asDetailQueryRoute(
  useGetEntityRelationQuery,
  ({ data, refetch }) => {
    return (
      <MikroEntityRelation.ModelPage
        title={data.entityRelation.linkedExpression.expression.label}
        object={data.entityRelation.id}
        pageActions={
          <>
            <KraphEntity.DetailLink
              object={data.entityRelation.left.id}
              subroute="graph"
            >
              <Button variant="outline" size="sm">
                Left
              </Button>
            </KraphEntity.DetailLink>
            <KraphEntity.DetailLink
              object={data.entityRelation.right.id}
              subroute="graph"
            >
              <Button variant="outline" size="sm">
                Right
              </Button>
            </KraphEntity.DetailLink>
            <Button variant="outline" size="sm">
              Record Protocolstep
            </Button>
            <FormDialog
              trigger={
                <Button variant="outline" size="sm">
                  Measure
                </Button>
              }
            >
              <CreateEntityMetricForm entity={data.entityRelation} />
            </FormDialog>
          </>
        }
      >
        <div className="font-bold text-xl"> Measurements </div>
        <div className="grid grid-cols-2 gap-2">
          {data?.entityRelation?.metrics.map((spec, i) => (
            <Card className="p-2 truncate" key={i}>
              <MikroEntityRelationMetric.DetailLink
                object={spec.value}
                className={"max-w-[80px] truncate "}
              >
                {spec.value}
              </MikroEntityRelationMetric.DetailLink>
            </Card>
          ))}
        </div>
      </MikroEntityRelation.ModelPage>
    );
  },
);
