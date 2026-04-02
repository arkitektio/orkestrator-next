import { Card } from "@/components/ui/card";
import { MikroImage, MikroMaskView } from "@/linkers";
import { MaskViewFragment } from "../../api/graphql";

interface HistoryCardProps {
  item: MaskViewFragment;

}

const TheCard = ({ item }: HistoryCardProps) => {
  return (
    <MikroMaskView.Smart object={item} key={item.id}>
      <Card key={item.id} className="p-4">
        <p className="font-light text-xs">Is mask for</p>
        <MikroImage.DetailLink object={item.referenceView.image}>
          {item.referenceView.image.name}
        </MikroImage.DetailLink>
      </Card>
    </MikroMaskView.Smart>
  );
};

export default TheCard;
