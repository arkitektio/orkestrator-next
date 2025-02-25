import { Card } from "@/components/ui/card";
import { KraphGraphQuery, KraphNodeQuery } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListGraphQueryFragment,
  ListNodeQueryFragment,
  usePinGraphMutation,
  usePinNodeQueryMutation,
} from "../../api/graphql";
import { PinButton } from "@/components/pin/PinButton";

interface Props {
  item: ListNodeQueryFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const [pin] = usePinNodeQueryMutation();

  return (
    <KraphNodeQuery.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate group">
        <KraphNodeQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
          <p className="text-xs font-light">{item.description}</p>
        </KraphNodeQuery.DetailLink>
        <PinButton
          item={item}
          func={pin}
          className="ml-auto text-xs p-1 group-hover:block hidden"
          variant={"outline"}
          size={"icon"}
        />
      </Card>
    </KraphNodeQuery.Smart>
  );
};

export default TheCard;
