import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestStructurePackage } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListStructurePackageFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListStructurePackageFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestStructurePackage.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestStructurePackage.DetailLink object={item?.id}>
              {" "}
              <h1>{item.key}</h1>
              <span className="text-muted-foreground font-light">
                {item.description}
              </span>
            </RekuestStructurePackage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </RekuestStructurePackage.Smart>
  );
};

export default TheCard;
