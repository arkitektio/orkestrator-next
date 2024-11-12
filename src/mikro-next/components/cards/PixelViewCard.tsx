import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  KraphEntity,
  MikroFile,
  MikroFileView,
  MikroImage,
  MikroPixelView,
  KraphProtocolStep,
  MikroROI,
  MikroROIView,
  MikroSpecimenView,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  DerivedViewFragment,
  FileViewFragment,
  PixelView,
  PixelViewFragment,
  RoiViewFragment,
  SpecimenViewFragment,
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
