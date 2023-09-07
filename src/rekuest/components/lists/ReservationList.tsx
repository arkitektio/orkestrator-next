import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import ReservationCard from "../cards/ReservationCard";

export type Props = {
};

const List = ({}: Props) => {
  const { settings } = useSettings();
  const { data, error, subscribeToMore, refetch } = withRekuest(
    useReservationsQuery,
  )({
    variables: { instanceId: settings.instanceId },
  });

  return (
    <>
    <ListRender
      array={data?.myreservations}
      title={
        <MikroDataset.ListLink className="flex-0">
          Reservations
        </MikroDataset.ListLink>
      }
    >
      {(ex, index) => <ReservationCard key={index} reservation={ex} mates={[]} />}
    </ListRender>
    </>
  );
};

export default List;
