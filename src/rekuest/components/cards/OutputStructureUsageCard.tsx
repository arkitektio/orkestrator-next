import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestOutputStructureUsage } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListOutputStructureUsageFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListOutputStructureUsageFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestOutputStructureUsage.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestOutputStructureUsage.DetailLink object={item?.id}>
              {" "}
              <h1>{item.portKey}</h1>
              <span className="text-muted-foreground font-light">
                {item.action.name}
              </span>
            </RekuestOutputStructureUsage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestOutputStructureUsage.Smart>
  );
};

export default TheCard;
