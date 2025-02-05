import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset, MikroMesh } from "@/linkers";
import {
  FileFilter,
  MeshFilter,
  OffsetPaginationInput,
  useGetFilesQuery,
  useListMeshesQuery,
} from "../../api/graphql";
import FileCard from "../cards/FileCard";
import MeshCard from "../cards/MeshCard";

export type Props = {
  filters?: MeshFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListMeshesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.meshes}
      title={
        <MikroDataset.ListLink className="flex-0">
          Latest Meshes
        </MikroDataset.ListLink>
      }
      actions={<MikroMesh.NewButton minimal />}
      refetch={refetch}
    >
      {(ex, index) => <MeshCard key={index} mesh={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
