import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlussRun } from "@/linkers";

import { ListRunFragment } from "@/reaktion/api/graphql";
import Timestamp from "react-timestamp";

interface Props {
  item: ListRunFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <FlussRun.Smart object={item?.id}>
      <Card className="aspect-square">
        <CardHeader>
          <CardTitle>
            <FlussRun.DetailLink object={item.id}>
              {item.flow.workspace.title}{" "}
            </FlussRun.DetailLink>
          </CardTitle>
          <CardDescription>
            <Timestamp date={item.createdAt} relative />
          </CardDescription>
        </CardHeader>
      </Card>
    </FlussRun.Smart>
  );
};

export default TheCard;
