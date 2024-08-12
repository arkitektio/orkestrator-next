import { Badge } from "@/components/ui/badge";
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
            {view.step?.kind.label}
            <div className="flex flex-col mt-1">
              {view?.step?.reagents.map((reagent) => (
                <Badge className="flex flex-row ">
                  <div className="flex-1 mr-1">{reagent.name}</div>
                  {reagent.metrics.map((m) => (
                    <Badge className="bg-black text-white">
                      {m.metric.kind.label}:{m.value}
                    </Badge>
                  ))}
                </Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroSpecimenView.Smart>
  );
};

export default TheCard;
