import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestInterface } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListInterfaceFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListInterfaceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestInterface.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestInterface.DetailLink object={item?.id}>
              {" "}
              <h1>{item.key}</h1>
              <span className="text-muted-foreground font-light">
                {item.description}
              </span>
            </RekuestInterface.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestInterface.Smart>
  );
};

export default TheCard;
