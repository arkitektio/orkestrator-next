import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment } from "@/rekuest/api/graphql";
import { NodeActionButton } from "@/rekuest/buttons/NodeActionButton";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { Play } from "lucide-react";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

export const ActionButton = (props: { node: ListNodeFragment }) => {
  return (
    <>
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant={"outline"}>
              <Play className="w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="text-white">
            {node && <DoForm node={node} assign={assign} />}
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};

const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

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
