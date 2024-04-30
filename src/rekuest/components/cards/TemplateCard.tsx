import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestNode, RekuestTemplate } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListNodeFragment, ListTemplateFragment } from "@/rekuest/api/graphql";
import { useUsage } from "@/rekuest/hooks/useNode";
import { NodeDescription } from "@jhnnsrs/rekuest";

interface Props {
  item: ListTemplateFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();

  const [isUsed, toggle] = useUsage({ template: item.id });

  return (
    <RekuestTemplate.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestTemplate.DetailLink object={item?.id}>
                {" "}
                {item.interface}
              </RekuestTemplate.DetailLink>
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
    </RekuestTemplate.Smart>
  );
};

export default TheCard;
