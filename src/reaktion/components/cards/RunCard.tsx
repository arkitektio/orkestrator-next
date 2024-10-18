import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlussRun } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListRunFragment } from "@/reaktion/api/graphql";
import Timestamp from "react-timestamp";

interface Props {
  item: ListRunFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <FlussRun.Smart
      object={item?.id}
      dragClassName={({ isOver, canDrop, isSelected, isDragging }) =>
        `relative rounded group text-white bg-center bg-back-999 shadow-lg h-20  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} ${
          isSelected && "ring-2 ring-secondary-500"
        }`
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <FlussRun.DetailLink object={item.id}>
              {item.flow.workspace.title}{" "}
            </FlussRun.DetailLink>
          </CardTitle>
          <CardDescription>
            <Timestamp date={item.createdAt} relative />
          </CardDescription>
        </CardHeader>
      </Card>
    </FlussRun.Smart>
  );
};

export default TheCard;
