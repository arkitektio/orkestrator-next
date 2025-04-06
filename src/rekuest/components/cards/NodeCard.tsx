import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment } from "@/rekuest/api/graphql";
import { NodeActionButton } from "@/rekuest/buttons/NodeActionButton";
import { ReserveActionButton } from "@/rekuest/buttons/ReserveActionButton";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

const TheCard = ({ node, mates }: Props) => {
  const reserveMate = useReserveMate();

  const progress = useLiveAssignation({
    assignedNode: node.id,
  });

  return (
    <RekuestNode.Smart object={node?.id} mates={[reserveMate]}>
      <Card
        className="group border border-gray-200 dark:border-gray-800 aspect-square ring ring-0 group-data-[selected=true]:ring-1  "
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-col justify-between p-3 h-full">
          <div className="flex-grow overflow-hidden">
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
          <CardFooter className="flex justify-between gap-2 truncate">
            <NodeActionButton id={node.id}>
              <Button variant="outline" size="sm" className="flex-1 truncate">
                Assign
              </Button>
            </NodeActionButton>
            <ReserveActionButton id={node.id}>
              <Button variant="outline" size="sm"  className="flex-1 truncate">
                Short
              </Button>
            </ReserveActionButton>
          </CardFooter>
        </CardHeader>
      </Card>
    </RekuestNode.Smart>
  );
};

export default TheCard;
