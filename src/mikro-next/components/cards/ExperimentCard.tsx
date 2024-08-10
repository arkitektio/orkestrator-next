import { Card } from "@/components/ui/card";
import { MikroExperiment } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListExperimentFragment } from "../../api/graphql";

interface Props {
  item: ListExperimentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <MikroExperiment.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <MikroExperiment.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </MikroExperiment.DetailLink>
        <MikroExperiment.ObjectButton object={item.id} />
      </Card>
    </MikroExperiment.Smart>
  );
};

export default TheCard;
