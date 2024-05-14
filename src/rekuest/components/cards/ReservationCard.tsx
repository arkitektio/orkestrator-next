import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverBorderGradient } from "@/components/ui/hover-button";
import { RekuestNode, RekuestReservation } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import {
  ListNodeFragment,
  PostmanReservationFragment,
} from "@/rekuest/api/graphql";

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
              {item.node.name}
              {item.status}
            </RekuestReservation.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestReservation.Smart>
  );
};

export default TheCard;
