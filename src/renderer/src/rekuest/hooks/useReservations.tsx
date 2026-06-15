import { useReservationsQuery } from "../api/graphql";

export const useReservations = () => {
  const queryResult = useReservationsQuery();

  return queryResult;
};
