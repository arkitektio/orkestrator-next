import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestToolbox } from "@/linkers";

import { ListToolboxFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListToolboxFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestToolbox.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestToolbox.DetailLink object={item?.id}>
              {" "}
              <h1>{item.name}</h1>
              <span className="text-muted-foreground font-light">
                {item.description}
              </span>
            </RekuestToolbox.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestToolbox.Smart>
  );
};

export default TheCard;
