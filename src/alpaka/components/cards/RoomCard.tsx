import { AlpakaRoom, LokClient } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListRoomFragment } from "../../api/graphql";

interface Props {
  item: ListRoomFragment;
  mates?: MateFinder[];
}

const Card = ({ item, mates }: Props) => {
  return (
    <AlpakaRoom.Smart
      object={item?.id}
      dragClassName={({ isOver, canDrop, isSelected, isDragging }) =>
        `relative rounded group text-white bg-center bg-back-999 shadow-lg h-20  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} ${
          isSelected && "ring-2 ring-secondary-500"
        }`
      }
      mates={mates}
    >
      <AlpakaRoom.DetailLink
        object={item.id}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {item.title}
      </AlpakaRoom.DetailLink>
    </AlpakaRoom.Smart>
  );
};

export default Card;
