import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroDataset } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDatasetFragment } from "../../api/graphql";

interface Props {
  dataset: ListDatasetFragment;
  mates?: MateFinder[];
}

const Card = ({ dataset, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroDataset.Smart
      object={dataset?.id}
      dragClassName={({ isOver, canDrop, isSelected, isDragging }) =>
        `relative rounded group text-white bg-center bg-background shadow-lg h-20  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} ${
          isSelected && "ring-2 ring-secondary-500"
        }`
      }
      mates={mates}
    >
      <div className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-background rounded rounded-full hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate">
        <MikroDataset.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={dataset.id}
        >
          {dataset?.name}
        </MikroDataset.DetailLink>
      </div>
    </MikroDataset.Smart>
  );
};

export default Card;
