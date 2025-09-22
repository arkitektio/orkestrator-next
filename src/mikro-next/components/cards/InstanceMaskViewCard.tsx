import { Card } from "@/components/ui/card";
import { MikroImage, MikroInstanceMaskView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { InstanceMaskViewFragment } from "../../api/graphql";

interface HistoryCardProps {
  item: InstanceMaskViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: HistoryCardProps) => {
  return (
    <MikroInstanceMaskView.Smart object={item?.id} mates={mates} key={item.id}>
      <Card key={item.id} className="p-4">
        <p className="text-light text-xs">Is instance mask for</p>
        <MikroImage.DetailLink object={item.referenceView.image.id}>
          {item.referenceView.image.name}
        </MikroImage.DetailLink>
      </Card>
    </MikroInstanceMaskView.Smart>
  );
};

export default TheCard;
