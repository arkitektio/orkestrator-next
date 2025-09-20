import { MikroLightpathView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { LightpathViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import { LightPathListView } from "../lightpath/LightPathListView";

interface Props {
  view: LightpathViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroLightpathView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view} className="h-20 flex flex-row p-3">
        <MikroLightpathView.DetailLink object={view?.id} className="flex flex-row">
          <span className="font-light mr-2 my-auto">
            {view.cMax}
          </span>
          <div className="font-light mr-2 my-auto">
            {view.graph && <LightPathListView graph={view.graph} />}
          </div>
        </MikroLightpathView.DetailLink>
      </ViewCard>
    </MikroLightpathView.Smart>
  );
};

export default TheCard;
