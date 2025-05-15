import { AlpakaProvider, AlpakaRoom, LokClient } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListProviderFragment, ListRoomFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListProviderFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <AlpakaProvider.Smart object={item?.id} mates={mates}>
      <Card className="w-full h-20 relative">
        <AlpakaProvider.DetailLink object={item.id}>
          {item.name}
        </AlpakaProvider.DetailLink>
        <div>{item.name}</div>
      </Card>
    </AlpakaProvider.Smart>
  );
};

export default TheCard;
