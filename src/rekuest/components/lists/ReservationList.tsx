import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import ReservationCard from "../cards/ReservationCard";
import { useReservations } from "@/rekuest/hooks/useReservations";

export type Props = {};

const List = ({}: Props) => {
  const { settings } = useSettings();
  const { data, error, subscribeToMore, refetch } = useReservations();
  return (
    <>
      <ListRender
        array={data?.reservations}
        title={
          <MikroDataset.ListLink className="flex-0">
            Reservations
          </MikroDataset.ListLink>
        }
      >
        {(ex, index) => <ReservationCard key={index} item={ex} mates={[]} />}
      </ListRender>
    </>
  );
};

export default List;
