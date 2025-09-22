import { Card } from "@/components/ui/card";
import { MikroImage, MikroMaskView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { MaskViewFragment } from "../../api/graphql";

interface HistoryCardProps {
  item: MaskViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: HistoryCardProps) => {
  return (
    <MikroMaskView.Smart object={item?.id} mates={mates} key={item.id}>
      <Card key={item.id} className="p-4">
        <p className="font-light text-xs">Is mask for</p>
        <MikroImage.DetailLink object={item.referenceView.image.id}>
          {item.referenceView.image.name}
        </MikroImage.DetailLink>
      </Card>
    </MikroMaskView.Smart>
  );
};

export default TheCard;
