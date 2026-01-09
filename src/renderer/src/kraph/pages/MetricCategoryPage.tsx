import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphMetricCategory } from "@/linkers";
import { useNavigate } from "react-router-dom";
import {
  useGetMetricCategoryQuery,
  useUpdateEntityCategoryMutation
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateMetricCategoryForm from "../forms/UpdateMetricCategoryForm";

export default asDetailQueryRoute(
  useGetMetricCategoryQuery,
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
              id: data.metricCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    const navigate = useNavigate();

    return (
      <KraphMetricCategory.ModelPage
        object={data.metricCategory.id}
        title={data?.metricCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphMetricCategory.Komments object={data.metricCategory.id} />
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
              <CreateGraphQueryForm category={data.metricCategory} />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateMetricCategoryForm metricCategory={data.metricCategory} />
            </FormSheet>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.metricCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.metricCategory.ageName}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.metricCategory?.store?.presignedUrl && (
              <Image
                src={resolve(data.metricCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6 h-full">
          {data.metricCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.metricCategory.bestQuery}
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
                <CreateGraphQueryForm category={data.metricCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphMetricCategory.ModelPage>
    );
  },
);
