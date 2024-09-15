import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  FileFilter,
  OffsetPaginationInput,
  useGetFilesQuery,
} from "../../api/graphql";
import FileCard from "../cards/FileCard";

export type Props = {
  filters?: FileFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetFilesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.files}
      title={
        <MikroDataset.ListLink className="flex-0">
          Latest Uploads
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <FileCard key={index} file={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
