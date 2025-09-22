import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestDependency } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListDependencyFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListDependencyFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();


  return (
    <RekuestDependency.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestDependency.DetailLink object={item?.id}>
                {" "}
                {item.action?.hash}
              </RekuestDependency.DetailLink>
            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
      </Card>
    </RekuestDependency.Smart>
  );
};

export default TheCard;
