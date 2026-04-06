import { Card } from "@/components/ui/card";
import { AlpakaRoom } from "@/linkers";
import { ListRoomFragment } from "../../api/graphql";

interface Props {
  item: ListRoomFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <AlpakaRoom.Smart object={item} >
      <Card className="w-full h-20 relative">
        <AlpakaRoom.DetailLink object={item}>
          {item.title}
        </AlpakaRoom.DetailLink>
        <div>{item.description}</div>
      </Card>
    </AlpakaRoom.Smart>
  );
};

export default TheCard;
