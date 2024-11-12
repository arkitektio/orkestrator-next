import { Card } from "@/components/ui/card";
import { KraphProtocol } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListProtocolFragment } from "@/kraph/api/graphql";

interface Props {
  item: ListProtocolFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphProtocol.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphProtocol.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphProtocol.DetailLink>
      </Card>
    </KraphProtocol.Smart>
  );
};

export default TheCard;
