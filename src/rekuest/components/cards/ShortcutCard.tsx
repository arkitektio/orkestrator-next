import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestShortcut } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListShortcutFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListShortcutFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestShortcut.Smart object={item?.id}>
      <Card className={cn("aspect-square flex flex-col")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestShortcut.DetailLink object={item?.id}>
              {" "}
              <h1>{item.name}</h1>
              <span className="text-muted-foreground font-light">
                {item.description}
              </span>
            </RekuestShortcut.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestShortcut.Smart>
  );
};

export default TheCard;
