import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestDependency, RekuestResolution } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListResolutionFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListResolutionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();


  return (
    <RekuestResolution.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between truncate ellipsis">
          <div>
            <CardTitle>
              <RekuestResolution.DetailLink object={item?.id}>
                {" "}
                {item.name}
              </RekuestResolution.DetailLink>

            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
      </Card>
    </RekuestResolution.Smart>
  );
};

export default TheCard;
