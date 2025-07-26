import { PinButton } from "@/components/pin/PinButton";
import { Card } from "@/components/ui/card";
import { KraphGraph } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListGraphFragment, usePinGraphMutation } from "../../api/graphql";

interface Props {
  item: ListGraphFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const [pin] = usePinGraphMutation();

  return (
    <KraphGraph.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate group">
        <KraphGraph.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphGraph.DetailLink>
        <div className="text-sm text-muted-foreground">
          {item?.description || "No Description"}
        </div>
      </Card>
    </KraphGraph.Smart>
  );
};

export default TheCard;
