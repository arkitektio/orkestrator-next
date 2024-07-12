import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroDataset } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDatasetFragment } from "../../api/graphql";

interface Props {
  dataset: ListDatasetFragment;
  mates?: MateFinder[];
}

const TheCard = ({ dataset, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroDataset.Smart object={dataset?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
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
