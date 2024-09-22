import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroTable } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListTableFragment } from "@/mikro-next/api/graphql";

interface Props {
  item: ListTableFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroTable.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <MikroTable.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </MikroTable.DetailLink>
      </Card>
    </MikroTable.Smart>
  );
};

export default TheCard;
