import { PortDefinition } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDefinitionFragment } from "../../api/graphql";

interface Props {
  definition: ListDefinitionFragment;
  mates?: MateFinder[];
}

const Card = ({ definition, mates }: Props) => {
  return (
    <PortDefinition.Smart
      object={definition?.id}
      dragClassName={({ isOver, canDrop, isDragging }) =>
        `relative rounded group text-white bg-center p-3 bg-slate-600 shadow-lg h-20  transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} `
      }
      mates={mates}
    >
      <PortDefinition.DetailLink
        className={({ isActive } /*  */) =>
          "z-10 font-bold text-md mb-2 cursor-pointer " +
          (isActive ? "text-primary-300" : "")
        }
        object={definition.id}
      >
        {definition?.id} {definition.name}
      </PortDefinition.DetailLink>
    </PortDefinition.Smart>
  );
};

export default Card;
