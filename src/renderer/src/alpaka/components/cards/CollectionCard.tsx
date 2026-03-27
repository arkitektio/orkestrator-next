import { Card } from "@/components/ui/card";
import { AlpakaCollection } from "@/linkers";
import { ListChromaCollectionFragment } from "../../api/graphql";

interface Props {
  item: ListChromaCollectionFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <AlpakaCollection.Smart object={item} >
      <Card className="w-full h-20 relative">
        <AlpakaCollection.DetailLink object={item}>
          {item.name}
        </AlpakaCollection.DetailLink>
        <div>{item.name}</div>
      </Card>
    </AlpakaCollection.Smart>
  );
};

export default TheCard;
