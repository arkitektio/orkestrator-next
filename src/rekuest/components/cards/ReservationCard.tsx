import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestReservation } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { MateFinder } from "@/mates/types";
import { PostmanReservationFragment } from "@/rekuest/api/graphql";

interface Props {
  item: PostmanReservationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const requestMate = useRequestMate();

  return (
    <RekuestReservation.Smart object={item?.id} mates={[requestMate]}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestReservation.DetailLink object={item?.id}>
              {" "}
              {item.action.name}
              {item.status}
            </RekuestReservation.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestReservation.Smart>
  );
};

export default TheCard;
