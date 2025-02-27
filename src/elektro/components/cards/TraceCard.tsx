import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ElektroTrace } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListTraceFragment } from "../../api/graphql";
interface Props {
  item: ListTraceFragment;
  mates?: MateFinder[];
  className?: string;
}

const TheCard = ({ item, mates, className}: Props) => {
  return (
    <ElektroTrace.Smart
      object={item?.id}
      mates={mates}
    >
      <Card
        className={cn(
          "px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate",
          className,
        )}
      >
      <ElektroTrace.DetailLink
        object={item.id}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {item.name}
      </ElektroTrace.DetailLink>
      </Card>
    </ElektroTrace.Smart>
  );
};

export default TheCard;
