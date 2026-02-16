import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphGraphQuery,
  KraphStructureRelationCategory
} from "@/linkers";
import {
  useGetStructureRelationCategoryQuery,
  useUpdateEntityCategoryMutation
} from "../api/graphql";
import CreateStructureRelationGraphQueryForm from "../forms/CreateStructureRelationGraphQueryForm";
import UpdateStructureRelationCategoryForm from "../forms/UpdateStructureRelationCategoryForm";

const Page = asDetailQueryRoute(
  useGetStructureRelationCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateEntityCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.structureRelationCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    return (
      <KraphStructureRelationCategory.ModelPage
        object={data.structureRelationCategory.id}
        title={data?.structureRelationCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphStructureRelationCategory.Komments
                  object={data.structureRelationCategory.id}
                />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <FormDialog
              trigger={<Button variant="outline">Create</Button>}
              onSubmit={() => refetch()}
            >
              <CreateStructureRelationGraphQueryForm
                category={data.structureRelationCategory}
              />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateStructureRelationCategoryForm
                structureRelationCategory={data.structureRelationCategory}
              />
            </FormSheet>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.structureRelationCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.structureRelationCategory.ageName}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.structureRelationCategory?.image?.presignedUrl && (
              <Image
                src={resolve(
                  data.structureRelationCategory?.image.presignedUrl,
                )}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

      </KraphStructureRelationCategory.ModelPage>
    );
  },
);

export default Page;
