import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListNodeFragment } from "@/kraph/api/graphql";
import { KraphGraph, KraphNode, KraphOntology } from "@/linkers";
import { MateFinder } from "@/mates/types";

interface Props {
  item: ListNodeFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphNode.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphNode.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item.__typename == "Structure" && (
            <>
              {item.identifier}
              {item.object}
            </>
          )}
          {item.__typename == "Entity" && <>{item.category.label}</>}
          {item.__typename == "Structure" && (
            <Button variant="outline" size="sm">
              View
            </Button>
          )}
        </KraphNode.DetailLink>
      </Card>
    </KraphNode.Smart>
  );
};

export default TheCard;
