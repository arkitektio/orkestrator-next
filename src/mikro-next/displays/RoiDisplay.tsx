import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroROI } from "@/linkers";
import { UserAvatar } from "@/lok-next/components/UserAvatar";
import { useGetRoiQuery } from "@/mikro-next/api/graphql";
import Timestamp from "react-timestamp";

export const RoiDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetRoiQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.roi;

  return (
    <MikroROI.DetailLink object={props.object}>
      {roi?.creator && <UserAvatar sub={roi.creator.sub} />}
      {roi?.createdAt && (
        <p>
          Marked <Timestamp date={roi.createdAt} relative />
        </p>
      )}
    </MikroROI.DetailLink>
  );
};
