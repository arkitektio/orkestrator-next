import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import AssignationCard from "../cards/AssignationCard";
import { useAssignations } from "@/rekuest/hooks/useAssignations";

export type Props = {};

const List = ({}: Props) => {
  const { data } = useAssignations();

  return (
    <>
      <ListRender
        array={data?.assignations}
        title={
          <MikroDataset.ListLink className="flex-0">
            Assignations
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
