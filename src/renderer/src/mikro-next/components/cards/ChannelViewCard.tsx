import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplay } from "@/lib/quantities";
import { MikroChannelView } from "@/linkers";

import { ChannelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: ChannelViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroChannelView.Smart object={view}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle> {view.channelName}</CardTitle>
          {(view.excitationWavelength || view.emissionWavelength) && (
            <div className="mt-1 flex flex-row gap-3 text-xs text-muted-foreground">
              {view.excitationWavelength && (
                <div>
                  <span className="text-muted">Ex</span>{" "}
                  {formatDisplay(view.excitationWavelength, "length")}
                </div>
              )}
              {view.emissionWavelength && (
                <div>
                  <span className="text-muted">Em</span>{" "}
                  {formatDisplay(view.emissionWavelength, "length")}
                </div>
              )}
            </div>
          )}
        </CardHeader>
      </ViewCard>
    </MikroChannelView.Smart>
  );
};

export default TheCard;
