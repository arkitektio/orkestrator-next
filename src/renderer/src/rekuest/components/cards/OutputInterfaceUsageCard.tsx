import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestOutputInterfaceUsage } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListOutputInterfaceUsageFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListOutputInterfaceUsageFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestOutputInterfaceUsage.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestOutputInterfaceUsage.DetailLink object={item?.id}>
              {" "}
              <h1>{item.portKey}</h1>
              <span className="text-muted-foreground font-light">
                {item.action.name}
              </span>
            </RekuestOutputInterfaceUsage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestOutputInterfaceUsage.Smart>
  );
};

export default TheCard;
