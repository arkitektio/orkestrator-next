import { MikroOpticsView, MikroInstrument } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { OpticsViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  view: OpticsViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroOpticsView.Smart
      object={view?.id}
      dragClassName={({ isOver, canDrop, isSelected, isDragging }) =>
        `relative rounded group text-white bg-center bg-back-999 shadow-lg h-20  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} ${
          isSelected && "ring-2 ring-secondary-500"
        }`
      }
      mates={mates}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.instrument && <MikroInstrument.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={view.instrument.id}
            >
              {view.instrument.name}
            </MikroInstrument.DetailLink>}
          </CardTitle>

        </CardHeader>
      </Card>
    </MikroOpticsView.Smart>
  );
};

export default TheCard;
