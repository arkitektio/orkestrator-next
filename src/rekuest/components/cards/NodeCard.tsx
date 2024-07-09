import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment } from "@/rekuest/api/graphql";
import { NodeActionButton } from "@/rekuest/buttons/NodeActionButton";
import { NodeDescription } from "@jhnnsrs/rekuest";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}



const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

  return (
    <RekuestNode.Smart object={node?.id} mates={[reserveMate]}>
      <Card className="group h-20 overflow-y-hidden">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestNode.DetailLink object={node?.id}>
                {" "}
                {node.name}
              </RekuestNode.DetailLink>
            </CardTitle>
            <CardDescription>
              {node?.description && (
                <NodeDescription description={node?.description} />
              )}
            </CardDescription>
          </div>
          <CardTitle>
            <NodeActionButton id={node.id}>
              <Button variant="outline" size="sm">
                Assign
              </Button>
            </NodeActionButton>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestNode.Smart>
  );
};

export default TheCard;
