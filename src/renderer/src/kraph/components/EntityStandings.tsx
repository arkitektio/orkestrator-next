import { useGetStandingsQuery } from "../api/graphql";
import { StandingsPanel } from "./StandingsPanel";

/**
 * The positions taken on one claim, read at claim grain.
 *
 * `standings(id:)` takes a bare uuid and no graph — whether a claim still holds
 * is an organization-wide question, decided by who said what and when, not by
 * whether any particular view has drawn it.
 */
export const EntityStandings = ({ id }: { id: string }) => {
  const { data } = useGetStandingsQuery({ variables: { id } });

  if (!data) return null;

  return (
    <div className="flex flex-col">
      <div className="px-3 pt-3 text-xs uppercase tracking-wide text-muted-foreground">
        Standings
      </div>
      <StandingsPanel standings={data.standings} />
    </div>
  );
};
