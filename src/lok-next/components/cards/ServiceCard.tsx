import { LokClient, LokService } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment, ListServiceFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListServiceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokService.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokService.DetailLink object={item.id} className="">
          {item.name} {item.logo}
        </LokService.DetailLink>
      </Card>
    </LokService.Smart>
  );
};

export default TheCard;
