import { MikroChannelView } from "@/linkers";
import { ChannelViewFragment } from "../../api/graphql";
import { MateFinder } from "@/mates/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
          <CardTitle> {view.channel.name}</CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroChannelView.Smart>
  );
};

export default TheCard;
