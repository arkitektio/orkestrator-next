import { Card } from "@/components/ui/card";
import { AlpakaCollection } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListChromaCollectionFragment } from "../../api/graphql";

interface Props {
  item: ListChromaCollectionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <AlpakaCollection.Smart object={item?.id} mates={mates}>
      <Card className="w-full h-20 relative">
        <AlpakaCollection.DetailLink object={item.id}>
          {item.name}
        </AlpakaCollection.DetailLink>
        <div>{item.name}</div>
      </Card>
    </AlpakaCollection.Smart>
  );
};

export default TheCard;
