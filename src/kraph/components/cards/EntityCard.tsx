import { Card } from "@/components/ui/card";
import { KraphEntity } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListEntityFragment } from "../../api/graphql";

interface Props {
  item: ListEntityFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphEntity.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphEntity.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </KraphEntity.DetailLink>
      </Card>
    </KraphEntity.Smart>
  );
};

export default TheCard;
