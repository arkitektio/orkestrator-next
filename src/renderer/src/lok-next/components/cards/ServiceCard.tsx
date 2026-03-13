import { Card } from "@/components/ui/card";
import { LokService } from "@/linkers";
import { ListServiceFragment } from "../../api/graphql";

interface Props {
  item: ListServiceFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <LokService.Smart object={item?.id} >
      <Card className="p-3">
        <LokService.DetailLink object={item.id} className="">
          {item.name}
        </LokService.DetailLink>
      </Card>
    </LokService.Smart>
  );
};

export default TheCard;
