import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment } from "@/rekuest/api/graphql";
import { useUsage } from "@/rekuest/hooks/useNode";
import { NodeDescription } from "@jhnnsrs/rekuest";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

  const [isUsed, toggle] = useUsage({hash: node.hash})

  return (
    <RekuestNode.Smart object={node?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
          <CardTitle>
            <RekuestNode.DetailLink object={node?.id}>
              {" "}
              {node.name}
            </RekuestNode.DetailLink>
          </CardTitle>
          <CardDescription>{node?.description && <NodeDescription description={node?.description}/>}</CardDescription>
          </div>
          <CardTitle>
          <Button onClick={() => toggle()}  variant={"ghost"}>{isUsed ? "Stop Using" : "Use"}</Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestNode.Smart>
  );
};

export default TheCard;
