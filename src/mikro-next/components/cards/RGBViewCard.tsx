import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { RgbViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RgbViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>{view.name}</CardTitle>
          <div
            className="w-2 h-2 rounded rounded-full"
            style={{ backgroundColor: view.fullColour }}
          ></div>
        </CardHeader>
      </ViewCard>
    </MikroRGBView.Smart>
  );
};

export default TheCard;
