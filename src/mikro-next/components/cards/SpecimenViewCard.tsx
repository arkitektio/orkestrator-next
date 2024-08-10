import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroSpecimenView } from "@/linkers";
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
            {" "}
            {view.step ? view.step.kind.label : "Unknown"}{" "}
            <div className="text-muted-foreground">
              {view?.step?.reagents.map((reagent) => reagent.name).join(", ")}
            </div>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroSpecimenView.Smart>
  );
};

export default TheCard;
