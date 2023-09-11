import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestNode } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment } from "@/rekuest/api/graphql";

interface Props {
  node: ListNodeFragment;
  mates?: MateFinder[];
}

const TheCard = ({ node, mates }: Props) => {

  const reserveMate = useReserveMate()



  return (
    <RekuestNode.Smart
      object={node?.id}
      mates={[reserveMate]}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestNode.DetailLink object={node?.id}>
            {" "}
            {node.name}
            </RekuestNode.DetailLink>
          </CardTitle>
          <CardDescription>
            {node?.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </RekuestNode.Smart>
  );
};

export default TheCard;
