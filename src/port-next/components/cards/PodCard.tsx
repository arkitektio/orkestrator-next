import { PortPod } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListPodFragment } from "../../api/graphql";

interface Props {
  pod: ListPodFragment;
  mates?: MateFinder[];
}

const Card = ({ pod, mates }: Props) => {
  return (
    <PortPod.Smart
      object={pod?.id}
      dragClassName={({ isOver, canDrop, isDragging }) =>
        `relative rounded group text-white bg-center p-3 bg-slate-600 shadow-lg h-20  transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} `
      }
      mates={mates}
    >
      <PortPod.DetailLink
        className={({ isActive } /*  */) =>
          "z-10 font-bold text-md mb-2 cursor-pointer " +
          (isActive ? "text-primary-300" : "")
        }
        object={pod.id}
      >
        {pod?.id} Nana
      </PortPod.DetailLink>
    </PortPod.Smart>
  );
};

export default Card;
