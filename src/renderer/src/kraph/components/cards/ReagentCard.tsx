import { Card } from "@/components/ui/card";
import { KraphReagent } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListReagentFragment } from "../../api/graphql";

interface Props {
  item: ListReagentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphReagent.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphReagent.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
        </KraphReagent.DetailLink>
      </Card>
    </KraphReagent.Smart>
  );
};

export default TheCard;
