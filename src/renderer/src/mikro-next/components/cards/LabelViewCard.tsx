import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroLabelView } from "@/linkers";
import { ViewCard } from "./meta/ViewCard";

// The `ActiveImageViews` query does not currently select any fields for
// `LabelView` beyond `__typename`, so `id`/`label` may be unavailable.
interface Props {
  view: { __typename?: "LabelView"; id?: string; label?: string };
}

const TheCard = ({ view }: Props) => {
  if (!view.id) return null;

  return (
    <MikroLabelView.Smart object={{ id: view.id }}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle> {view.label}</CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroLabelView.Smart>
  );
};

export default TheCard;
