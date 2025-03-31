import { Card } from "@/components/ui/card";
import { KraphMetric, KraphReagent } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListMetricFragment, ListReagentFragment } from "../../api/graphql";

interface Props {
  item: ListMetricFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphMetric.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphMetric.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </KraphMetric.DetailLink>
      </Card>
    </KraphMetric.Smart>
  );
};

export default TheCard;
