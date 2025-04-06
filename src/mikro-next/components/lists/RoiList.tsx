import { ListRender } from "@/components/layout/ListRender";
import { MikroROI } from "@/linkers";
import {
  OffsetPaginationInput,
  RoiFilter,
  Ordering,
  useGetRoIsQuery
} from "../../api/graphql";
import RoiCard from "../cards/RoiCard";

export type Props = {
  filters?: RoiFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetRoIsQuery({
    variables: { filters, pagination, order: { createdAt: Ordering.Desc } },
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
      {(ex, index) => <RoiCard key={ex.id} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
