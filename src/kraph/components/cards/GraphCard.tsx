import { Card } from "@/components/ui/card";
import { KraphGraph, KraphOntology } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListGraphFragment,
  ListOntologyFragment,
  usePinGraphMutation,
} from "../../api/graphql";
import { Badge } from "@/components/ui/badge";
import { PinButton } from "@/components/pin/PinButton";

interface Props {
  item: ListGraphFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const [pin] = usePinGraphMutation();

  return (
    <KraphGraph.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate group">
        <KraphGraph.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphGraph.DetailLink>
        <PinButton
          item={item}
          func={pin}
          className="ml-auto text-xs p-1 group-hover:block hidden"
          variant={"outline"}
          size={"icon"}
        />
      </Card>
    </KraphGraph.Smart>
  );
};

export default TheCard;
