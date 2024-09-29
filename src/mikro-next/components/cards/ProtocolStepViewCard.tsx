import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroProtocolStep, MikroProtocolStepView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ProtocolStepViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: ProtocolStepViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroProtocolStepView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-light ">
              {" "}
              {view.step && (
                <MikroProtocolStep.DetailLink object={view.step?.id}>
                  {view.step?.name}
                </MikroProtocolStep.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroProtocolStepView.Smart>
  );
};

export default TheCard;
