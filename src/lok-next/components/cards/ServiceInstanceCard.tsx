import { Card } from "@/components/ui/card";
import { LokServiceInstance } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListServiceInstanceFragment } from "../../api/graphql";

interface Props {
  item: ListServiceInstanceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokServiceInstance.Smart object={item?.id} mates={mates}>
      <Card className="p-3 flex flex-col">
        <LokServiceInstance.DetailLink object={item.id} className="">
          {item.identifier}
        </LokServiceInstance.DetailLink>
        <div className="text-xs">configured by {item.backend}</div>
      </Card>
    </LokServiceInstance.Smart>
  );
};

export default TheCard;
