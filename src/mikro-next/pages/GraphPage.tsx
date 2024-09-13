import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MikroGraph, MikroLinkedExpression } from "@/linkers";
import { useGetGraphQuery } from "../api/graphql";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "lucide-react";
import LinkExpressionForm from "../forms/LinkExpressionForm";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  return (
    <MikroGraph.ModelPage
      object={data.graph.id}
      title={data.graph.name}
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Graph"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Link Expression
              </>
            }
            onSubmit={(item) => {
              console.log(item);
              navigate(MikroLinkedExpression.linkBuilder(item.createGraph.id));
            }}
          >
            <LinkExpressionForm graph={data.graph.id} />
          </FormDialogAction>
        </>
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
        <MikroGraph.DetailLink
          object={data.graph.id}
          subroute="entities"
          className=""
        >
          Entitites{" "}
        </MikroGraph.DetailLink>
        <div className="grid grid-cols-6 gap-2">
          {data?.graph?.entities?.map((item, i) => (
            <LinkedExpressionCard
              item={item}
              key={i}
              hideGraph={true}
              hideExpression={true}
            />
          ))}
        </div>
      </div>
      <div className="p-6">
        <MikroGraph.DetailLink
          object={data.graph.id}
          subroute="relations"
          className=""
        >
          Relations{" "}
        </MikroGraph.DetailLink>
        <div className="grid grid-cols-6 gap-2">
          {data?.graph?.relations?.map((item, i) => (
            <LinkedExpressionCard
              item={item}
              key={i}
              hideGraph={true}
              hideExpression={true}
            />
          ))}
        </div>
      </div>
    </MikroGraph.ModelPage>
  );
});
