import { Card } from "@/components/ui/card";
import { LokRelease } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListReleaseFragment } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokRelease.Smart object={item?.id} mates={mates}>
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
