import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestInputStructureUsage } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListInputStructureUsageFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListInputStructureUsageFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestInputStructureUsage.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestInputStructureUsage.DetailLink object={item?.id}>
              {" "}
              <h1>{item.portKey}</h1>
              <span className="text-muted-foreground font-light">
                {item.action.name}
              </span>
            </RekuestInputStructureUsage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestInputStructureUsage.Smart>
  );
};

export default TheCard;
