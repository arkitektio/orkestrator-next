import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroLabelView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { LabelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: LabelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroLabelView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle> {view.label}</CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroLabelView.Smart>
  );
};

export default TheCard;
