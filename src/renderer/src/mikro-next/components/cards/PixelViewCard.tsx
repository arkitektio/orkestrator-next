import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroFileView,
  MikroPixelView
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  PixelViewFragment
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: PixelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroFileView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xl">
              {view.id && (
                <MikroPixelView.DetailLink object={view.id}>
                  Pixel Meaning
                </MikroPixelView.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroFileView.Smart>
  );
};

export default TheCard;
