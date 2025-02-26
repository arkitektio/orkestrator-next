import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphExpression, KraphOntology } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetOntologyQuery,
  useUpdateOntologyMutation
} from "../api/graphql";
import GenericCategoryCard from "../components/cards/GenericCategoryCard";
import GraphCard from "../components/cards/GraphCard";
import GraphQueryCard from "../components/cards/GraphQueryCard";
import MeasurementCategoryCard from "../components/cards/MeasurementCategoryCard";
import NodeQueryCard from "../components/cards/NodeQueryCard";
import RelationCategoryCard from "../components/cards/RelationCategoryCard";
import StructureCategoryCard from "../components/cards/StructureCategoryCard";
import CreateExpressionForm from "../forms/CreateStructureCategoryForm";
import { UpdateOntologyForm } from "../forms/UpdateOntologyForm";
import { ListRender } from "@/components/layout/ListRender";


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
    <KraphOntology.ModelPage
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
                navigate(KraphExpression.linkBuilder(item.createExpression.id));
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
          <KraphOntology.ObjectButton object={data.ontology.id} />
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphOntology.Komments object={data.ontology.id} />,
          }}
        />
      }
    >
      <div className="w-full h-full p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
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

        
          <ListRender
          title="Entities"
          array={data.ontology.genericCategories}
          refetch={refetch}
          >
          {item => <GenericCategoryCard item={item} />}
          </ListRender>
          <ListRender
          title="Structures"
          array={data.ontology.structureCategories}
          refetch={refetch}
          >
          {item => <StructureCategoryCard item={item} />}
          </ListRender>
          <ListRender
          title="Measurements"
          array={data.ontology.measurementCategories}
          refetch={refetch}
          >
          {item => <MeasurementCategoryCard item={item} />}
          </ListRender>
          <ListRender
          title="Relations"
          array={data.ontology.relationCategories}
          refetch={refetch}
          >
          {item => <RelationCategoryCard item={item} />}
          </ListRender>
          <ListRender 
          title="Graphs"
          array={data.ontology.graphs}
          refetch={refetch}
          >
          {item => <GraphCard item={item} />}
          </ListRender>
          <ListRender
          title="Queries"
          array={data.ontology.graphQueries}
          refetch={refetch}
          >
          {item => <GraphQueryCard item={item} />}
          </ListRender>
          <ListRender
          title="Node Queries"
          array={data.ontology.nodeQueries}
          refetch={refetch}
          >
          {item => <NodeQueryCard item={item} />}
          </ListRender>
          
      </div>
    </KraphOntology.ModelPage>
  );
});
