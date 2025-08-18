import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphStructureCategory
} from "@/linkers";
import { useNavigate } from "react-router-dom";
import {
  useGetStructureCategoryQuery,
  useUpdateStructureCategoryMutation,
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import { StructureQueriesPlanner } from "../components/StructureQueriesPlanner";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateStructureCategoryForm from "../forms/UpdateStructureCategoryForm";

export default asDetailQueryRoute(
  useGetStructureCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateStructureCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.structureCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    const pin = async () => {
      await update({
        variables: {
          input: {
            id: data.structureCategory.id,
            pin: !data.structureCategory.pinned,
          },
        },
      });
      await refetch();
    };

    const navigate = useNavigate();

    return (
      <KraphStructureCategory.ModelPage
        object={data.structureCategory.id}
        title={data?.structureCategory.identifier}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphStructureCategory.Komments
                  object={data.structureCategory.id}
                />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                pin();
              }}
              className="w-full"
              variant="outline"
            >
              {data.structureCategory.pinned ? "Unpin" : "Pin"}
            </Button>
            <FormDialog
              trigger={<Button variant="outline">Create</Button>}
              onSubmit={() => refetch()}
            >
              <CreateGraphQueryForm category={data.structureCategory} />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateStructureCategoryForm
                structureCategory={data.structureCategory}
              />
            </FormSheet>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.structureCategory.identifier}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.structureCategory.graph.name}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.structureCategory?.store?.presignedUrl && (
              <Image
                src={resolve(data.structureCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <StructureQueriesPlanner category={data.structureCategory} />

        <div className="flex flex-col p-6 h-full">
          {data.structureCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.structureCategory.bestQuery}
            />
          ) : (
            <div className="h-ful w-ull flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-3">
                No Graph Query yet for this category
              </p>
              <FormDialog
                trigger={<Button variant="outline">Create Query</Button>}
                onSubmit={() => refetch()}
              >
                <CreateGraphQueryForm category={data.structureCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphStructureCategory.ModelPage>
    );
  },
);
