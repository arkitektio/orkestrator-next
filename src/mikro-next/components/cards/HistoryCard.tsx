import { MikroHistory, RekuestAssignation } from "@/linkers";
import { useDatalayer } from "@jhnnsrs/datalayer";
import { MateFinder } from "../../../mates/types";
import { HistoryFragment } from "../../api/graphql";

interface HistoryCardProps {
  history: HistoryFragment;
  mates?: MateFinder[];
}

const HistoryCard = ({ history, mates }: HistoryCardProps) => {
  const { s3resolve } = useDatalayer();

  return (
    <MikroHistory.Smart
      object={history?.id}
      dragClassName={({ isOver, canDrop, isSelected, isDragging }) =>
        `relative rounded group text-white bg-center bg-back-999 shadow-lg h-20  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} ${
          isSelected && "ring-2 ring-secondary-500"
        }`
      }
      mates={mates}
    >
      <div className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate">
        {history.during && (
          <RekuestAssignation.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={history.during}
          >
            Open Assignation
          </RekuestAssignation.DetailLink>
        )}
        {history.kind}
      </div>
    </MikroHistory.Smart>
  );
};

export default HistoryCard;
