import { useSettings } from "@/providers/settings/SettingsContext";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import React from "react";
import { useReservationsQuery } from "../api/graphql";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { RekuestReservation } from "@/linkers";
import { ContainerGrid } from "@/components/layout/ContainerGrid";

export type IMyReservationsProps = {};

const Reservations: React.FC<IMyReservationsProps> = () => {
  const { settings } = useSettings();
  const { data } = withRekuest(useReservationsQuery)({
    fetchPolicy: "cache-and-network",
    variables: {
      instanceId: settings.instanceId,
    },
  });
  const requesterMate = useRequestMate();

  return (
    <>
      <RekuestReservation.ListLink className="font-light text-xl dark:text-white">
        This app uses
      </RekuestReservation.ListLink>
      <div className="mt-2 mb-4">
        <ContainerGrid>
          {data?.reservations
            ?.filter(notEmpty)
            .map((res, index) => (
              <ReservationCard
                key={index}
                reservation={res}
                mates={[requesterMate(res)]}
              />
            ))}
        </ContainerGrid>
      </div>
    </>
  );
};

export { Reservations };
