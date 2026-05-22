import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroROI } from "@/linkers";
import { useGetRoiQuery } from "@/mikro-next/api/graphql";
import { FinalRender } from "../components/render/FInalRender";

export const RoiDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetRoiQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.roi;
  if (!roi) {
    return <div className="text-xs text-muted-foreground">ROI not found</div>;
  }

  if (props.context === "command") {
    return (
      <MikroROI.DetailLink object={roi}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">
            {roi.kind}
          </span>
          <span className="font-medium text-sm truncate">{roi.image.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {roi.vectors.length} {roi.vectors.length === 1 ? "point" : "points"}
          </span>
        </div>
      </MikroROI.DetailLink>
    );
  }

  const context = data?.roi.image.rgbContexts.at(0);
  return (
    <div className="w-full h-full">
      {context && (
        <FinalRender
          context={context}
          rois={[data.roi]}
          z={data.roi.vectors.at(0)?.at(2)}
          t={data.roi.vectors.at(0)?.at(0)}
          hideControls={true}
        />
      )}
    </div>
  );
};
