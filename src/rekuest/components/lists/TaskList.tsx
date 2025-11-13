import { ListRender } from "@/components/layout/ListRender";
import { RekuestAssignation } from "@/linkers";
import { AssignationFilter, AssignationOrder, OffsetPaginationInput, useListAssignationsQuery } from "@/rekuest/api/graphql";
import TaskCard from "../cards/TaskCard";

export type Props = {
  filters?: AssignationFilter;
  order?: AssignationOrder;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, order, pagination }: Props) => {
  const { data, error, refetch } = useListAssignationsQuery({
    variables: {
      filter: filters,

      order: order,
      pagination: pagination,
    },
  });
  return (
    <>
      <ListRender
        array={data?.tasks}
        title={
          <RekuestAssignation.ListLink className="flex-0">
            Latest Tasks
          </RekuestAssignation.ListLink>
        }
        refetch={refetch}
        error={error}
      >
        {(ex, index) => (
          <TaskCard key={index} item={ex} />
        )}
      </ListRender>
    </>
  );
};

export default List;
