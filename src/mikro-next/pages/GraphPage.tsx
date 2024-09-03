import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetGraphQuery } from "../api/graphql";
import { EntitiesTable } from "../components/tables/EntitiesTable";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  return <EntitiesTable graph={data?.graph.id} />;
});
