import { ListRender } from "@/components/layout/ListRender";
import { MikroFile } from "@/linkers";
import {
  FileFilter,
  FileOrder,
  OffsetPaginationInput,
  useGetFilesQuery,
} from "../../api/graphql";
import FileCard from "../cards/FileCard";

export type Props = {
  filters?: FileFilter;
  pagination?: OffsetPaginationInput;
  order?: FileOrder
};

const List = ({ filters, pagination, order }: Props) => {
  const { data, refetch } = useGetFilesQuery({
    variables: { filters, pagination, order },
  });

  return (
    <ListRender
      array={data?.files}
      title={
        <MikroFile.ListLink className="flex-0">
          Latest Uploads
        </MikroFile.ListLink>
      }
      refetch={refetch}
    >
      {(ex) => <FileCard key={ex.id} file={ex} />}
    </ListRender>
  );
};

export default List;
