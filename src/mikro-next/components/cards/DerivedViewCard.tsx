import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  KraphEntity,
  MikroFile,
  MikroFileView,
  MikroImage,
  KraphProtocolStep,
  MikroROI,
  MikroROIView,
  MikroSpecimenView,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  DerivedViewFragment,
  FileViewFragment,
  RoiViewFragment,
  SpecimenViewFragment,
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: DerivedViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroFileView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xs">
              Derived through {view.operation} from{" "}
            </p>
            <p className="font-bold text-xl">
              {view.originImage && (
                <MikroImage.DetailLink object={view.originImage?.id}>
                  {view.originImage?.name}
                </MikroImage.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroFileView.Smart>
  );
};

export default TheCard;
