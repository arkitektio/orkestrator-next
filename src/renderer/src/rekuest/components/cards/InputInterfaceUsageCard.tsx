import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestInputInterfaceUsage } from "@/linkers";

import { ListInputInterfaceUsageFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListInputInterfaceUsageFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestInputInterfaceUsage.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestInputInterfaceUsage.DetailLink object={item?.id}>
              {" "}
              <h1>{item.portKey}</h1>
              <span className="text-muted-foreground font-light">
                {item.action.name}
              </span>
            </RekuestInputInterfaceUsage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestInputInterfaceUsage.Smart>
  );
};

export default TheCard;
