import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ElektroSimulation } from "@/linkers";
import { ListSimulationFragment } from "../../api/graphql";


interface Props {
  item: ListSimulationFragment;
  className?: string;
}

const TheCard = ({ item, className }: Props) => {
  return (
    <ElektroSimulation.Smart object={item?.id}>
      <Card
        className={cn(
          "px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate items-center justify-center flex",
          className,
        )}
      >
        <ElektroSimulation.DetailLink
          object={item.id}
          className="transition-all ease-in-out duration-200 truncate"
        >
          {item.name}
        </ElektroSimulation.DetailLink>
      </Card>
    </ElektroSimulation.Smart>
  );
};

export default TheCard;
