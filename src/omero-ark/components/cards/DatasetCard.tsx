import { Card } from "@/components/ui/card";
import { OmeroArkDataset } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDatasetFragment } from "@/omero-ark/api/graphql";


interface Props {
  dataset: ListDatasetFragment;
  mates?: MateFinder[];
}

const TCard = ({ dataset, mates }: Props) => {
  return (
    <OmeroArkDataset.Smart
      object={dataset?.id}
    >
      <Card className="px-2 py-2 h-full w-full top-0 ">
        <OmeroArkDataset.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={dataset.id}
        >
          {dataset?.name}
        </OmeroArkDataset.DetailLink>
      </Card>
    </OmeroArkDataset.Smart>
  );
};

export default TCard;
