import { Card } from "@/components/ui/card";
import { KraphGraphQuery, KraphGraphView, KraphNodeView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListGraphQueryFragment,
  ListGraphViewFragment,
  ListNodeViewFragment,
} from "../../api/graphql";

interface Props {
  item: ListGraphViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphGraphView.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphGraphView.DetailLink
          className={({ isActive } /*̉  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </KraphGraphView.DetailLink>
      </Card>
    </KraphGraphView.Smart>
  );
};

export default TheCard;
