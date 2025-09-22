import { PinButton } from "@/components/pin/PinButton";
import { Card } from "@/components/ui/card";
import { KraphGraphQuery } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListGraphQueryFragment,
  usePinGraphQueryMutation,
} from "../../api/graphql";

interface Props {
  item: ListGraphQueryFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const [pin] = usePinGraphQueryMutation();

  return (
    <KraphGraphQuery.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphGraphQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
          <p className="text-xs font-light">{item.description}</p>
        </KraphGraphQuery.DetailLink>
        <PinButton
          item={item}
          func={pin}
          className="ml-auto text-xs p-1 group-hover:block hidden"
          variant={"outline"}
          size={"icon"}
        />
      </Card>
    </KraphGraphQuery.Smart>
  );
};

export default TheCard;
