import { Card } from "@/components/ui/card";
import { KraphNodeQuery } from "@/linkers";
import {
  ListNodeQueryFragment,
} from "../../api/graphql";

interface Props {
  item: ListNodeQueryFragment;
}

const TheCard = ({ item }: Props) => {

  return (
    <KraphNodeQuery.Smart object={item}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate group">
        <KraphNodeQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item}
        >
          {item?.label}
          <p className="text-xs font-light">{item.description}</p>
        </KraphNodeQuery.DetailLink>
      </Card>
    </KraphNodeQuery.Smart>
  );
};

export default TheCard;
