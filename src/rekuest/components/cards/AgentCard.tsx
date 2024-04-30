import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestReservation } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { MateFinder } from "@/mates/types";
import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestReservation.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestReservation.DetailLink object={item?.id}>
              {" "}
              {item.instanceId}
              {item.status}
            </RekuestReservation.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestReservation.Smart>
  );
};

export default TheCard;
