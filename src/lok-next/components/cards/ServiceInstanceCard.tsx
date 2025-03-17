import { LokClient, LokService, LokServiceInstance } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  BackendType,
  ListClientFragment,
  ListServiceFragment,
  ListServiceInstanceFragment,
} from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListServiceInstanceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokServiceInstance.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        {item.identifier}<br />
        <LokServiceInstance.DetailLink object={item.id} className="">
          {item.backend}
        </LokServiceInstance.DetailLink>
        {item.backend != BackendType.UserDefined && (
          <p className="text-xs mt-2"> This backend is handled internally and you cannot change its configuration</p>
        )}
      </Card>
    </LokServiceInstance.Smart>
  );
};

export default TheCard;
