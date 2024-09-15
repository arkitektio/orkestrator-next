import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { MikroGraph, MikroLinkedExpression } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { useGetGraphQuery } from "../api/graphql";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import LinkExpressionForm from "../forms/LinkExpressionForm";
import { UpdateGraphForm } from "../forms/UpdateGraphForm";

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  return (
    <MikroGraph.ModelPage
      object={data.graph.id}
      title={data.graph.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <MikroGraph.DetailLink object={data.graph.id} subroute="entities">
            <Button variant={"outline"} size={"sm"}>
              All Entities
            </Button>
          </MikroGraph.DetailLink>
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
          <FormSheet trigger={<HobbyKnifeIcon />}>
            {data?.graph && <UpdateGraphForm graph={data?.graph} />}
          </FormSheet>
        </div>
      }
      sidebars={<MikroGraph.Komments object={data.graph.id} />}
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
