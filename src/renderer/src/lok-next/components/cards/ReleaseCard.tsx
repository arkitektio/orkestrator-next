import { Card } from "@/components/ui/card";
import { LokRelease } from "@/linkers";
import { ListReleaseFragment } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <LokRelease.Smart object={item?.id} >
      <Card className="p-3">
        <LokRelease.DetailLink object={item.id} className="">
          {item.version}
          <br />
        </LokRelease.DetailLink>
      </Card>
    </LokRelease.Smart>
  );
};

export default TheCard;
