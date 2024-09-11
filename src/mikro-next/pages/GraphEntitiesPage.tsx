import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetGraphQuery, useListLinkedExpressionQuery } from "../api/graphql";
import { EntitiesTable } from "../components/tables/EntitiesTable";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const { data: xdata, error } = useListLinkedExpressionQuery({
    variables: {
      graph: data?.graph.id,
      pinned: true,
    },
  });

  console.log("X", xdata);

  return (
    <>
      <EntitiesTable graph={data?.graph.id} />
    </>
  );
});
