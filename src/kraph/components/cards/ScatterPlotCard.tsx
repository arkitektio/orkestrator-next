import { PinButton } from "@/components/pin/PinButton";
import { Card } from "@/components/ui/card";
import { KraphGraphQuery, KraphScatterPlot } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListGraphQueryFragment,
  ListScatterPlotFragment,
  usePinGraphQueryMutation,
} from "../../api/graphql";

interface Props {
  item: ListScatterPlotFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {

  return (
    <KraphScatterPlot.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphScatterPlot.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
          <p className="text-xs font-light">{item.name}</p>
        </KraphScatterPlot.DetailLink>
      </Card>
    </KraphScatterPlot.Smart>
  );
};

export default TheCard;
