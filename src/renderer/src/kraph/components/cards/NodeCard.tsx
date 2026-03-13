import { Card } from "@/components/ui/card";
import { ListNodeFragment } from "@/kraph/api/graphql";
import { KraphNode } from "@/linkers";

interface Props {
  item: ListNodeFragment;
}

const TheCard = ({ item }: Props) => {
  return (
    <KraphNode.Smart object={item?.id}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphNode.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >

          {item.label}
        </KraphNode.DetailLink>
      </Card>
    </KraphNode.Smart>
  );
};

export default TheCard;
