import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroROI,
  MikroROIView
} from "@/linkers";
import { RoiViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RoiViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroROIView.Smart object={view?.id} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-md font-light mb-1">Represents ROI</p>
            <p className="font-bold text-xl">
              {view.roi && (
                <MikroROI.DetailLink object={view.roi?.id}>
                  {view.roi?.id}
                </MikroROI.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroROIView.Smart>
  );
};

export default TheCard;
