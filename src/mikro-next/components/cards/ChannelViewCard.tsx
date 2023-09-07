import { MikroChannelView } from "@/linkers";
import { ChannelViewFragment } from "../../api/graphql";
import { MateFinder } from "@/mates/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  view: ChannelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroChannelView.Smart
      object={view?.id}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.channel.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </MikroChannelView.Smart>
  );
};

export default TheCard;
