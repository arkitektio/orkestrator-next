import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntity, KraphEntityCategory } from "@/linkers";
import {
  useCreateEntityMutation,
  useGetEntityCategoryQuery,
  useUpdateEntityCategoryMutation,
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import { StructureQueriesPlanner } from "../components/StructureQueriesPlanner";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateEntityCategoryForm from "../forms/UpdateEntityCategoryForm";
import { ActionButton } from "@/components/ui/action";
import { LocalActionButton } from "@/components/ui/localactionbutton";
import { DialogButton, LocalDialogButton } from "@/components/ui/dialogbutton";
import { Badge } from "@/components/ui/badge";

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
    });

    const resolve = useResolve();

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
              Comments: (
                <KraphEntityCategory.Komments object={data.entityCategory.id} />
              ),
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
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.entityCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.entityCategory.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {data.entityCategory.ageName}
            </p>
            <div className="flex flex-row gap-2">
              {data.entityCategory.tags.map((tag) => (
                <Badge key={tag.id}>{tag.value}</Badge>
              ))}
            </div>
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
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <StructureQueriesPlanner category={data.entityCategory} />


        <div className="flex flex-col p-6 h-full">
          {data.entityCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.entityCategory.bestQuery}
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
                <CreateGraphQueryForm category={data.entityCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphEntityCategory.ModelPage>
    );
  },
);
