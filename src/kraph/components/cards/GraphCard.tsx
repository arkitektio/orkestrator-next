import { Card } from "@/components/ui/card";
import { KraphGraph, KraphOntology } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListGraphFragment, ListOntologyFragment } from "../../api/graphql";

interface Props {
  item: ListGraphFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphGraph.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphGraph.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphGraph.DetailLink>
      </Card>
    </KraphGraph.Smart>
  );
};

export default TheCard;
