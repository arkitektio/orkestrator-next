import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroROI } from "@/linkers";
import { UserAvatar } from "@/lok-next/components/UserAvatar";
import { useGetRoiQuery } from "@/mikro-next/api/graphql";
import Timestamp from "react-timestamp";
import { DelegatingImageRender } from "../components/render/DelegatingImageRender";
import { FinalRender } from "../components/render/FInalRender";

export const RoiDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetRoiQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.roi;
  if (!roi) {
    return <div>ROI not found</div>;
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
