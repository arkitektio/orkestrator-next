import { Button } from "@/components/ui/button";
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
import { useUsage } from "@/rekuest/hooks/useNode";

interface Props {
  item: ListDependencyFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();

  const [isUsed, toggle] = useUsage({ template: item.id });

  return (
    <RekuestDependency.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestDependency.DetailLink object={item?.id}>
                {" "}
                {item.node?.hash}
              </RekuestDependency.DetailLink>
            </CardTitle>
            <CardDescription></CardDescription>
          </div>
          <CardTitle>
            <Button onClick={() => toggle()} variant={"ghost"}>
              {isUsed ? "Stop Using" : "Use"}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestDependency.Smart>
  );
};

export default TheCard;
