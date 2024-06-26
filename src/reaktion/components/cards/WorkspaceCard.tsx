import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlussWorkspace } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListWorkspaceFragment } from "@/rekuest/api/graphql";
import Timestamp from "react-timestamp";

interface Props {
  workspace: ListWorkspaceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ workspace, mates }: Props) => {
  return (
    <FlussWorkspace.Smart
      object={workspace?.id}
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
            <FlussWorkspace.DetailLink object={workspace.id}>
              {workspace.title}
            </FlussWorkspace.DetailLink>
          </CardTitle>
          <CardDescription>
            {workspace.description || "No description"}
            <br />
            {workspace.latestFlow?.createdAt && (
              <Timestamp date={workspace.latestFlow.createdAt} />
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </FlussWorkspace.Smart>
  );
};

export default TheCard;
