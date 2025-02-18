import { Card } from "@/components/ui/card";
import { KraphGraphQuery } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListGraphQueryFragment } from "../../api/graphql";

interface Props {
  item: ListGraphQueryFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphGraphQuery.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphGraphQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphGraphQuery.DetailLink>
      </Card>
    </KraphGraphQuery.Smart>
  );
};

export default TheCard;
