import { ListRender } from "@/components/layout/ListRender";
import { FlussWorkspace } from "@/linkers";
import {
  OffsetPaginationInput,
  useWorkspacesQuery,
} from "@/reaktion/api/graphql";
import { withFluss } from "@jhnnsrs/fluss";
import WorkspaceCard from "../cards/WorkspaceCard";

export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = ({ pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withFluss(
    useWorkspacesQuery,
  )({
    variables: { pagination },
  });

  return (
    <ListRender
      array={data?.workspaces}
      title={
        <FlussWorkspace.ListLink className="flex-0">
          Workspaces
        </FlussWorkspace.ListLink>
      }
      refetch={refetch}
    >
      {(item, index) => (
        <WorkspaceCard key={index} workspace={item} mates={[]} />
      )}
    </ListRender>
  );
};

export default List;
