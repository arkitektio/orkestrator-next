import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestStructure } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListStructureFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListStructureFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestStructure.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestStructure.DetailLink object={item?.id}>
              {" "}
              <h1>{item.key}</h1>
              <span className="text-muted-foreground font-light">
                {item.description}
              </span>
            </RekuestStructure.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestStructure.Smart>
  );
};

export default TheCard;
