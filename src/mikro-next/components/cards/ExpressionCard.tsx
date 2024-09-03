import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroExpression } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListExpressionFragment } from "@/mikro-next/api/graphql";

interface Props {
  item: ListExpressionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <MikroExpression.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <MikroExpression.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </MikroExpression.DetailLink>
        <p className="text-sm text-muted-foreground">{item?.description}</p>
      </Card>
    </MikroExpression.Smart>
  );
};

export default TheCard;
