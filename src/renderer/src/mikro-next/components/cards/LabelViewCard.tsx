import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroLabelView } from "@/linkers";
import { LabelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: LabelViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroLabelView.Smart object={view} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle> {view.label}</CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroLabelView.Smart>
  );
};

export default TheCard;
