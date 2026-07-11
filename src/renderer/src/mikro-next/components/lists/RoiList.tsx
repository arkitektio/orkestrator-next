import { ListRender } from "@/components/layout/ListRender";
import { MikroROI } from "@/linkers";
import {
  OffsetPaginationInput,
  Ordering,
  RoiFilter,
  useGetRoIsQuery
} from "../../api/graphql";
import RoiCard from "../cards/RoiCard";

export type Props = {
  filters?: RoiFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, refetch } = useGetRoIsQuery({
    variables: { filters, pagination, ordering: [{ createdAt: Ordering.Desc }] },
  });



  return (
    <ListRender
      array={data?.rois}
      title={
        <MikroROI.ListLink className="flex-0">
          Latest Rois
        </MikroROI.ListLink>
      }
      actions={<MikroROI.NewButton minimal />}
      refetch={refetch}
    >
      {(ex) => <RoiCard key={ex.id} item={ex} />}
    </ListRender>
  );
};

export default List;
