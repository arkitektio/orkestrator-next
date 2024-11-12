import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphExpression, KraphGraph, KraphLinkedExpression } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListLinkedExpressionFragment,
  usePinLinkedExpressionMutation,
} from "@/kraph/api/graphql";

interface Props {
  item: ListLinkedExpressionFragment;
  mates?: MateFinder[];
  hideGraph?: boolean;
  hideExpression?: boolean;
}

const TheCard = ({ item, mates, hideGraph, hideExpression }: Props) => {
  const resolve = useResolve();

  const [link] = usePinLinkedExpressionMutation({});

  return (
    <KraphLinkedExpression.Smart object={item?.id} mates={mates}>
      <Card className=" h-20 transition-all ease-in-out duration-200 truncate relative">
        {item.expression?.store?.presignedUrl && (
          <Image
            src={resolve(item.expression?.store?.presignedUrl)}
            style={{ filter: "brightness(0.2)" }}
            className="z-3 object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
          />
        )}
        <div className="z-10 px-2 py-2 absolute top-0 left-0 w-full h-full rounded rounded-lg flex flex-col">
          <div className="flex flex-row justify-between">
            <KraphLinkedExpression.DetailLink
              object={item.id}
              className="z-10 font-bold text-md mb-2 cursor-pointer"
            >
              {item?.expression?.label}
            </KraphLinkedExpression.DetailLink>
            {item.pinned ? (
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() =>
                  link({ variables: { input: { id: item.id, pin: false } } })
                }
              >
                Unpin
              </Button>
            ) : (
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() =>
                  link({ variables: { input: { id: item.id, pin: true } } })
                }
              >
                Pin
              </Button>
            )}
          </div>

          {!hideGraph && (
            <KraphGraph.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={item.graph.id}
            >
              {item?.graph.name}
            </KraphGraph.DetailLink>
          )}
          {!hideExpression && (
            <KraphExpression.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={item.expression?.id}
            >
              {item?.expression?.label}
            </KraphExpression.DetailLink>
          )}
        </div>
      </Card>
    </KraphLinkedExpression.Smart>
  );
};

export default TheCard;
