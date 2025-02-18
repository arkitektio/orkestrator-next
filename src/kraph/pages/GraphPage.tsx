import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph, KraphLinkedExpression } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { Divide, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PathFragment, useGetGraphQuery, useRenderGraphQuery } from "../api/graphql";

import { UpdateGraphForm } from "../forms/UpdateGraphForm";
import { useState } from "react";
import { PathGraph } from "../components/graph/KnowledgeGraph";


export const PathRenderer = (props: {path: PathFragment}) => {


  return (
    <div>
      {props.path.nodes.map((node, i) => (
        <div key={i}>
          {node.__typename}
        </div>
      ))}
    </div>
  )
}


const ViewRenderer = (props: {graph: string, view: string}) => {

  const { data, error} = useRenderGraphQuery({
    variables: {
      graph: props.graph,
      query: props.view
    }
  })

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }


  if (data.renderGraph.__typename === "Pairs") {
    return <div>Pair Rendering</div>
  }

  if (data.renderGraph.__typename === "Path") {
    return <PathGraph path={data.renderGraph} />
  }



}

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  


  const [query, setQuery] = useState<string | undefined>(undefined);

  return (
    <KraphGraph.ModelPage
      object={data.graph.id}
      title={data.graph.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <KraphGraph.DetailLink object={data.graph.id} subroute="entities">
            <Button variant={"outline"} size={"sm"}>
              All Entities
            </Button>
          </KraphGraph.DetailLink>
          <FormSheet trigger={<HobbyKnifeIcon />}>
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}
          </FormSheet>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphGraph.Komments object={data.graph.id} />,
          }}
        />
      }
    >
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
      <div className="p-6">
        {data.graph.ontology.graphQueries.map((item, i) => (
          <div key={i} onClick={() => setQuery(item.id)}>ddd{item.query}</div>
        ))}
      </div>

      <div className="p-6 h-96">
        {query && <ViewRenderer graph={data.graph.id} view={query} />}
      </div>

      <div className="p-6">
        <KraphGraph.DetailLink
          object={data.graph.id}
          subroute="entities"
          className=""
        >
          Entitites{" "}
        </KraphGraph.DetailLink>
        <div className="grid grid-cols-6 gap-2">
          {data?.graph?.latestNodes?.map((item, i) => <> {item.__typename}</>)}
        </div>
      </div>
    </KraphGraph.ModelPage>
  );
});
