import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MikroFile } from "@/linkers";
import { cn } from "@udecode/cn";
import { ListFileFragment } from "../../api/graphql";

interface Props {
  item: ListFileFragment;
  className?: string;
}

const TheCard = ({ item, className }: Props) => {
  return (
    <MikroFile.Smart object={item} key={item.id}>
      <Card
        className={cn(
          "px-2 py-2  max-h-20 min-h-10 justify-center flex items-center ",
          className,
        )}
      >
        <CardTitle className="line-clamp-2 break-words">
          <MikroFile.DetailLink object={item}>
            {item.name}
          </MikroFile.DetailLink>
        </CardTitle>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex flex-row gap-2">
            <div className="font-light">Size:</div>
            <div>{item.creator.sub} bytes</div>
          </div>
        </CardContent>
      </Card>
    </MikroFile.Smart>
  );
};

export default TheCard;
