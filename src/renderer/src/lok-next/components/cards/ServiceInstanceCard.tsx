import { Card } from "@/components/ui/card";
import { LokServiceInstance } from "@/linkers";
import { ListServiceInstanceFragment } from "../../api/graphql";

interface Props {
  item: ListServiceInstanceFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <LokServiceInstance.Smart object={item?.id} >
      <Card className="p-3 flex flex-col">
        <LokServiceInstance.DetailLink object={item.id} className="">
          {item.identifier}
        </LokServiceInstance.DetailLink>
        <div className="text-xs">configured for {item.service.id}</div>
      </Card>
    </LokServiceInstance.Smart>
  );
};

export default TheCard;
