import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetGraphQuery, useListLinkedExpressionQuery } from "../api/graphql";
import { EntitiesTable } from "../components/tables/EntitiesTable";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import { Link } from "react-router-dom";
import { MikroGraph } from "@/linkers";
import { object } from "yup";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  return (
    <MikroGraph.ModelPage object={data.graph.id} title={data.graph.name}>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.graph.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.graph.description}
          </p>
        </div>
      </div>
      <MikroGraph.DetailLink
        object={data.graph.id}
        subroute="entities"
        className=""
      >
        Entitites{" "}
      </MikroGraph.DetailLink>
      <div className="grid grid-cols-6 gap-2">
        {data?.graph?.linkedExpressions?.map((item, i) => (
          <LinkedExpressionCard item={item} key={i} hideGraph={true} />
        ))}
      </div>
    </MikroGraph.ModelPage>
  );
});
