import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphExpression } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListExpressionFragment } from "@/kraph/api/graphql";

interface Props {
  item: ListExpressionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const s3resolve = useResolve();

  return (
    <KraphExpression.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate relative">
        {item?.store?.presignedUrl && (
          <Image
            src={s3resolve(item?.store?.presignedUrl)}
            style={{ filter: "brightness(0.2)" }}
            className="z-3 object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
          />
        )}
        <div className="p-3 h-full w-full absolute top-0 left-0 bg-opacity-20  hover:bg-opacity-10 transition-all ease-in-out duration-200 flex flex-col break-all overflow-y-hidden">
          <KraphExpression.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={item.id}
          >
            {item?.label}
          </KraphExpression.DetailLink>
          <p className="text-sm text-muted-foreground">{item?.description}</p>
        </div>
      </Card>
    </KraphExpression.Smart>
  );
};

export default TheCard;