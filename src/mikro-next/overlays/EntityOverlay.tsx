import { MikroROI } from "@/linkers";
import { useGetEntityQuery } from "../api/graphql";
import { Card } from "@/components/ui/card";

export const EntityOverlay = (props: { entity?: string }) => {
  const { data } = useGetEntityQuery({
    variables: {
      id: props.entity,
    },
  });

  return (
    <div>
      {data?.entity?.linkedExpression.expression.label}

      <div className="text-sm text-gray-500m mt-2">Marked as ROI in </div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.rois.map((roi, i) => (
          <Card className="p-2 truncate">
            <MikroROI.DetailLink
              object={roi.id}
              className={"max-w-[80px] truncate "}
            >
              {roi.image.name}
            </MikroROI.DetailLink>
            {roi.kind}
          </Card>
        ))}
      </div>
    </div>
  );
};
