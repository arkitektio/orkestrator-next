import { Card } from "@/components/ui/card";
import { LokService } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListServiceFragment } from "../../api/graphql";

interface Props {
  item: ListServiceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokService.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokService.DetailLink object={item.id} className="">
          {item.name}
        </LokService.DetailLink>
      </Card>
    </LokService.Smart>
  );
};

export default TheCard;
