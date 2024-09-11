import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroExpression, MikroGraph, MikroLinkedExpression } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListLinkedExpressionFragment,
  usePinLinkedExpressionMutation,
} from "@/mikro-next/api/graphql";

interface Props {
  item: ListLinkedExpressionFragment;
  mates?: MateFinder[];
  hideGraph?: boolean;
  hideExpression?: boolean;
}

const TheCard = ({ item, mates, hideGraph, hideExpression }: Props) => {
  const s3resolve = useResolve();

  const [link] = usePinLinkedExpressionMutation({});

  return (
    <MikroLinkedExpression.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        {item.pinned ? (
          <Button
            onClick={() =>
              link({ variables: { input: { id: item.id, pin: false } } })
            }
          >
            Unpin
          </Button>
        ) : (
          <Button
            onClick={() =>
              link({ variables: { input: { id: item.id, pin: true } } })
            }
          >
            Pin
          </Button>
        )}

        {!hideGraph && (
          <MikroGraph.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={item.graph.id}
          >
            {item?.graph.name}
          </MikroGraph.DetailLink>
        )}
        {!hideExpression && (
          <MikroExpression.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={item.expression?.id}
          >
            {item?.expression?.label}
          </MikroExpression.DetailLink>
        )}
      </Card>
    </MikroLinkedExpression.Smart>
  );
};

export default TheCard;
