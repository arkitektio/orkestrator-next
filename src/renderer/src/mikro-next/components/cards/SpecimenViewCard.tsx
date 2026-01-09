import { CardHeader, CardTitle } from "@/components/ui/card";
import { KraphNode, MikroSpecimenView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { SpecimenViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: SpecimenViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroSpecimenView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-light ">Specimen: </p>
            <p className="font-bold text-xl">
              {view.entity && (
                <KraphNode.DetailLink object={view.entity?.id}>
                  {view.entity?.label}
                </KraphNode.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroSpecimenView.Smart>
  );
};

export default TheCard;
