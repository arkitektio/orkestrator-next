import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import { useAssignations } from "@/rekuest/hooks/useAssignations";
import AssignationCard from "../cards/AssignationCard";

export type Props = {};

const List = ({}: Props) => {
  const { data } = useAssignations();

  return (
    <>
      <ListRender
        array={data?.assignations}
        title={
          <MikroDataset.ListLink className="flex-0">
            Latest Tasks
          </MikroDataset.ListLink>
        }
      >
        {(ex, index) => (
          <AssignationCard key={index} assignation={ex} mates={[]} />
        )}
      </ListRender>
    </>
  );
};

export default List;
