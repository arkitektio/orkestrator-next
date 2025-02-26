import { Card } from "@/components/ui/card";
import { KraphNodeView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListNodeViewFragment
} from "../../api/graphql";

interface Props {
  item: ListNodeViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphNodeView.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate group">
        <KraphNodeView.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </KraphNodeView.DetailLink>
      </Card>
    </KraphNodeView.Smart>
  );
};

export default TheCard;
