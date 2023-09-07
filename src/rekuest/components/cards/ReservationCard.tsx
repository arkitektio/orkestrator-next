import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestNode, RekuestReservation } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment, PostmanReservationFragment } from "@/rekuest/api/graphql";

interface Props {
  reservation: PostmanReservationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ reservation, mates }: Props) => {

  const requestMate = useRequestMate()


  return (
    <RekuestReservation.Smart
      object={reservation?.id}
      mates={[requestMate]}
    >
      <Card>
        <CardHeader>
          <CardTitle>
          <RekuestReservation.DetailLink object={reservation?.id}>
            {" "}
            {reservation.node.name}
            </RekuestReservation.DetailLink>
            
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestReservation.Smart>
  );
};

export default TheCard;
