import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroEntity,
  MikroProtocolStep,
  MikroROI,
  MikroROIView,
  MikroSpecimenView,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { RoiViewFragment, SpecimenViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RoiViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroROIView.Smart object={view?.id} mates={mates}>
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
