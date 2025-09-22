import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroChannelView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ChannelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: ChannelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroChannelView.Smart object={view?.id}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle> {view.channelName}</CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroChannelView.Smart>
  );
};

export default TheCard;
