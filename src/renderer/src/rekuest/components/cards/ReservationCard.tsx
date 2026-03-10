import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestReservation } from "@/linkers";
import { PostmanReservationFragment } from "@/rekuest/api/graphql";

interface Props {
  item: PostmanReservationFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestReservation.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestReservation.DetailLink object={item?.id}>
              {" "}
              {item.action.name}
            </RekuestReservation.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestReservation.Smart>
  );
};

export default TheCard;
