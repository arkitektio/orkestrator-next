import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@/lib/utils";
import { MikroDataset } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDatasetFragment } from "../../api/graphql";

interface Props {
  dataset: ListDatasetFragment;
  mates?: MateFinder[];
  className?: string;
}

const TheCard = ({ dataset, mates, className }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroDataset.Smart object={dataset?.id} mates={mates}>
      <Card
        className={cn(
          "px-2 py-2 h-20 flex transition-all ease-in-out duration-200 truncate items-center justify-center group hover:bg-back-800 hover:shadow-xl",
          className,
        )}
      >
        <MikroDataset.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={dataset.id}
        >
          {dataset?.name}
        </MikroDataset.DetailLink>
      </Card>
    </MikroDataset.Smart>
  );
};

export default TheCard;
