import { MikroLightpathView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { LightpathViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import { LightPathGraph } from "../lightpath/LightPathGraph";

interface Props {
  view: LightpathViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroLightpathView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view} className="h-20">
        <MikroLightpathView.DetailLink object={view?.id}>
          {view.graph && <LightPathGraph graph={view.graph} />}
        </MikroLightpathView.DetailLink>
      </ViewCard>
    </MikroLightpathView.Smart>
  );
};

export default TheCard;
