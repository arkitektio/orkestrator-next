import { Card } from "@/components/ui/card";
import { KraphScatterPlot } from "@/linkers";
import {
  ListScatterPlotFragment
} from "../../api/graphql";

interface Props {
  item: ListScatterPlotFragment;
}

const TheCard = ({ item }: Props) => {

  return (
    <KraphScatterPlot.Smart object={item?.id}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphScatterPlot.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
          <p className="text-xs font-light">{item.label}</p>
        </KraphScatterPlot.DetailLink>
      </Card>
    </KraphScatterPlot.Smart>
  );
};

export default TheCard;
