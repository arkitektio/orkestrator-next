import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntityCategory } from "@/linkers";
import { useNavigate } from "react-router-dom";
import {
  useCreateReagentMutation,
  useGetReagentCategoryQuery,
  useUpdateEntityCategoryMutation,
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateReagentCategoryForm from "../forms/UpdateReagentCategoryForm";
import { Badge } from "@/components/ui/badge";

export default asDetailQueryRoute(
  useGetReagentCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateEntityCategoryMutation();

    const [quickCreate] = useCreateReagentMutation({
      variables: {
        input: {
          reagentCategory: data.reagentCategory.id,
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
              id: data.reagentCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    const navigate = useNavigate();

    return (
      <KraphEntityCategory.ModelPage
        object={data.reagentCategory.id}
        title={data?.reagentCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphEntityCategory.Komments
                  object={data.reagentCategory.id}
                />
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
            <FormDialog
              trigger={<Button variant="outline">Create</Button>}
              onSubmit={() => refetch()}
            >
              <CreateGraphQueryForm category={data.reagentCategory} />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateReagentCategoryForm
                reagentCategory={data.reagentCategory}
              />
            </FormSheet>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.reagentCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.reagentCategory.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {data.reagentCategory.ageName}
            </p>
            {data.reagentCategory.tags.map((tag) => (
              <Badge key={tag.id}>{tag.value}</Badge>
            ))}
          </div>
          <div className="w-full h-full flex-row relative">
            {data.reagentCategory?.store?.presignedUrl && (
              <Image
                src={resolve(data.reagentCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6 h-full">
          {data.reagentCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.reagentCategory.bestQuery}
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
                <CreateGraphQueryForm category={data.reagentCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphEntityCategory.ModelPage>
    );
  },
);
