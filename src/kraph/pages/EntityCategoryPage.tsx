import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntityCategory } from "@/linkers";
import {
  EntityNodesDocument,
  useCreateEntityMutation,
  useGetEntityCategoryQuery,
  useUpdateEntityCategoryMutation,
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateEntityCategoryForm from "../forms/UpdateEntityCategoryForm";
import GraphQueryList from "../components/lists/GraphQueryList";
import { EntityList } from "../components/renderers/node_list/EntityList";
import { EntityCategorySidebar } from "../sidebars/EntityCategorySidebar";
import { useDialog } from "@/app/dialog";
import { Plus } from "lucide-react";

export default asDetailQueryRoute(
  useGetEntityCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateEntityCategoryMutation();

    const [quickCreate] = useCreateEntityMutation({
      variables: {
        input: {
          entityCategory: data.entityCategory.id,
        },
      },
      refetchQueries: [{ query: EntityNodesDocument, }],
    });

    const resolve = useResolve();

    const { openDialog, openSheet } = useDialog();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.entityCategory.id,
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
            id: data.entityCategory.id,
            pin: !data.entityCategory.pinned,
          },
        },
      });
      await refetch();
    };

    return (
      <KraphEntityCategory.ModelPage
        object={data.entityCategory.id}
        title={data?.entityCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Stats: <EntityCategorySidebar category={data.entityCategory.id} />,
              Comments: (
                <KraphEntityCategory.Komments object={data.entityCategory.id} />
              ),
              Queries: <>
                <GraphQueryList filters={{ relevantFor: data.entityCategory.id }} />
              </>
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                quickCreate().then(refetch);
              }}
              className="w-full"
              variant="outline"
            >
              Quick+
            </Button>
            <Button
              onClick={() => {
                pin().then(refetch);
              }}
              className="w-full"
              variant="outline"
            >
              {data.entityCategory.pinned ? "Unpin" : "Pin"}
            </Button>
            <FormDialog
              trigger={<Button variant="outline">Create</Button>}
              onSubmit={() => refetch()}
            >
              <CreateGraphQueryForm category={data.entityCategory} />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateEntityCategoryForm entityCategory={data.entityCategory} />
            </FormSheet>
            <KraphEntityCategory.ObjectButton
              object={data.entityCategory.id}
              className="w-full"
            />
            <Button
              variant="outline"
              onClick={() =>
                openSheet("createentitywithproperties", {
                  category: data.entityCategory,
                }, { size: "large" })
              }
            >
              <Plus className="h-3 w-3 mr-2" />
              Create {data.entityCategory.label || "Entity"}
            </Button>
          </div>
        }
      >
        <div className="p-6 flex flex-col flex-initial">
          <div className="col-span-4 mb-6 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {data.entityCategory.label} <div className="inline-block font-light text-gray-300">List </div>
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">
                {data.entityCategory.description}
              </p>
            </div>
            <div className="w-full h-full flex-row relative">
              {data.entityCategory?.store?.presignedUrl && (
                <Image
                  src={resolve(data.entityCategory?.store.presignedUrl)}
                  style={{ filter: "brightness(0.7)" }}
                  className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
                />
              )}
            </div>

            <DragZone uploadFile={uploadFile} createFile={createFile} />

          </div>
          <div className="flex-grow">

            <EntityList
              category={data.entityCategory}
            />
          </div>
        </div>
      </KraphEntityCategory.ModelPage>
    );
  },
);
