import { PinButton } from "@/components/pin/PinButton";
import { Card } from "@/components/ui/card";
import { KraphNodeQuery } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListNodeQueryFragment,
} from "../../api/graphql";

interface Props {
  item: ListNodeQueryFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {

  return (
    <KraphNodeQuery.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate group">
        <KraphNodeQuery.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.label}
          <p className="text-xs font-light">{item.description}</p>
        </KraphNodeQuery.DetailLink>
        <PinButton
          item={item}
          func={() => {}}
          className="ml-auto text-xs p-1 group-hover:block hidden"
          variant={"outline"}
          size={"icon"}
        />
      </Card>
    </KraphNodeQuery.Smart>
  );
};

export default TheCard;
