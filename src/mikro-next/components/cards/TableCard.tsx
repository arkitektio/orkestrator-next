import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroDataset } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListTableFragment } from "@/mikro-next/api/graphql";

interface Props {
  item: ListTableFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroDataset.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <MikroDataset.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </MikroDataset.DetailLink>
      </Card>
    </MikroDataset.Smart>
  );
};

export default TheCard;
