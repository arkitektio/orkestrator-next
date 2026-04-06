import { MikroLightpathView } from "@/linkers";
import { LightpathViewFragment } from "../../api/graphql";
import { LightPathListView } from "../lightpath/LightPathListView";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: LightpathViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroLightpathView.Smart object={view} >
      <ViewCard view={view} className="h-20 flex flex-row p-3 overflow-hidden">
        <MikroLightpathView.DetailLink object={view} className="flex flex-row">
          <span className="font-light mr-2 my-auto">
            {view.cMax}
          </span>
          <div className="font-light mr-2 my-auto ">
            {view.graph && <LightPathListView graph={view.graph} />}
          </div>
        </MikroLightpathView.DetailLink>
      </ViewCard>
    </MikroLightpathView.Smart>
  );
};

export default TheCard;
