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
    <FlussWorkspace.Smart object={workspace?.id}>
      <Card className="aspect-square">
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
