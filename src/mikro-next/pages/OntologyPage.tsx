import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { MikroExpression, MikroOntology } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  GetKnowledgeGraphQuery,
  useGetOntologyQuery,
  useUpdateOntologyMutation,
} from "../api/graphql";
import ExpressionCard from "../components/cards/ExpressionCard";
import CreateExpressionForm from "../forms/CreateExpressionForm";
import { UpdateOntologyForm } from "../forms/UpdateOntologyForm";

cytoscape.use(cola);

export const graphToElements: (graph: GetKnowledgeGraphQuery) => any = (
  graph,
) => {
  return {
    nodes: graph.knowledgeGraph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
      },
    })),
    edges: graph.knowledgeGraph.edges.map((edge) => ({
      data: {
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
    })),
  };
};

const nodeStyle = {
  shape: "round-rectangle",
  width: "100px",
  height: "40px",
  label: "data(label)",
  backgroundColor: "#121E2B",
  "text-valign": "center",
  color: "#94A3B8",
  "border-color": "#94A3B8",
  "border-width": 0.5,
  "font-family":
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

export default asDetailQueryRoute(useGetOntologyQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  const [update] = useUpdateOntologyMutation();
  const resolve = useResolve();

  const createFile = async (file: File, key: string) => {
    update({
      variables: {
        input: {
          id: data.ontology.id,
          image: key,
        },
      },
    });
  };

  const navigate = useNavigate();

  return (
    <MikroOntology.ModelPage
      object={data.ontology.id}
      title={data.ontology.name}
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Graph"
              buttonChildren={
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Expression
                </>
              }
              onSubmit={(item) => {
                console.log(item);
                navigate(MikroExpression.linkBuilder(item.createExpression.id));
              }}
            >
              <CreateExpressionForm ontology={data.ontology.id} />
            </FormDialogAction>
          </>
          <FormSheet
            trigger={
              <Button size="icon" variant={"outline"}>
                <HobbyKnifeIcon />
              </Button>
            }
          >
            {data?.ontology && <UpdateOntologyForm ontology={data?.ontology} />}
          </FormSheet>
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroOntology.Komments object={data.ontology.id} />,
          }}
        />
      }
    >
      <div className="w-full h-full">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.ontology.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.ontology.description || "No description"}
            </p>
          </div>
          <div className="w-full h-full flex-row relative min-h-[200px]">
            {data.ontology?.store?.presignedUrl && (
              <Image
                src={resolve(data.ontology.store?.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {data.ontology.expressions.map((expression) => (
              <ExpressionCard key={expression.id} item={expression} />
            ))}
          </div>
        </div>
      </div>
    </MikroOntology.ModelPage>
  );
});
