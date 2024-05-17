import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestAgent, RekuestReservation } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { MateFinder } from "@/mates/types";
import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestAgent.Smart object={item?.id}>
      <Card className={cn(item.connected && "dark:border-green-300 border")}>
        <CardHeader>
          <CardTitle>
            <RekuestAgent.DetailLink object={item?.id}>
              {" "}
              {item.instanceId}
              {item.status}
            </RekuestAgent.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAgent.Smart>
  );
};

export default TheCard;
