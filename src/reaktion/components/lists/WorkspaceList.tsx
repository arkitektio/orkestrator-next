import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset, RekuestWorkspace } from "@/linkers";
import {
  OffsetPaginationInput,
  useWorkspacesQuery,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import WorkspaceCard from "../cards/WorkspaceCard";

export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = ({ pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withRekuest(
    useWorkspacesQuery,
  )({
    variables: { pagination },
  });

  return (
    <ListRender
      array={data?.workspaces}
      title={
        <RekuestWorkspace.ListLink className="flex-0">
          Workspaces
        </RekuestWorkspace.ListLink>
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
