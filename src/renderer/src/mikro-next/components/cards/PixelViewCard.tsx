import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroFileView,
  MikroPixelView
} from "@/linkers";
import {
  PixelViewFragment
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: PixelViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroFileView.Smart object={view} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xl">
              {view.id && (
                <MikroPixelView.DetailLink object={view}>
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
