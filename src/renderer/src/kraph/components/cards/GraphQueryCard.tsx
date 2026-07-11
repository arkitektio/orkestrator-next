import { Card } from "@/components/ui/card";
import { KraphGraphQuery } from "@/linkers";
import {
  ListGraphQueryFragment,
} from "../../api/graphql";

interface Props {
  item: ListGraphQueryFragment;
}

const TheCard = ({ item }: Props) => {

  return (
    <KraphGraphQuery.Smart object={item} >
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphGraphQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item}
        >
          {item?.label}
          <p className="text-xs font-light">{item.description}</p>
        </KraphGraphQuery.DetailLink>
      </Card>
    </KraphGraphQuery.Smart>
  );
};

export default TheCard;
