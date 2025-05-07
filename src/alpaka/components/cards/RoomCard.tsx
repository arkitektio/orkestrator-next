import { AlpakaRoom } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListRoomFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListRoomFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <AlpakaRoom.Smart object={item?.id} mates={mates}>
          <Card className="w-full h-20 relative">
            <AlpakaRoom.DetailLink object={item.id}>
              {item.title}
            </AlpakaRoom.DetailLink>
            <div>{item.description}</div>
          </Card>
        </AlpakaRoom.Smart>
  );
};

export default TheCard;
