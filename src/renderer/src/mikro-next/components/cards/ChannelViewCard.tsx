import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroChannelView } from "@/linkers";

import { ChannelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: ChannelViewFragment;

}

const TheCard = ({ view }: Props) => {
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
