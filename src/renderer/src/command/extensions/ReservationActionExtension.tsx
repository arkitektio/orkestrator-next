import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "@/rekuest/api/graphql";
import { FilteredCommands } from "../components/FilteredCommands";

export const ReservationExtensions = () => {
  const { settings } = useSettings();
  const { data } = useReservationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return (
    <>
      <FilteredCommands
        actions={data?.reservations.map((x) => ({
          key: "assign:" + x.id,
          label: "Assign to " + x.title,
          run: async () => alert("Assign"),
        }))}
        heading="Assign"
      />
    </>
  );
};
