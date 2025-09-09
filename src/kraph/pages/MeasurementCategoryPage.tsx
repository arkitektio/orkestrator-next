import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphMeasurementCategory,
  KraphMetricCategory
} from "@/linkers";
import { useNavigate } from "react-router-dom";
import {
  useGetMeasurmentCategoryQuery,
  useUpdateEntityCategoryMutation
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import UpdateMeasurementCategoryForm from "../forms/UpdateMeasurementCategoryForm";

export default asDetailQueryRoute(
  useGetMeasurmentCategoryQuery,
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
              id: data.measurementCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    const navigate = useNavigate();

    return (
      <KraphMeasurementCategory.ModelPage
        object={data.measurementCategory.id}
        title={data?.measurementCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphMetricCategory.Komments
                  object={data.measurementCategory.id}
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
              <CreateGraphQueryForm category={data.measurementCategory} />
            </FormDialog>
            <FormSheet
              trigger={<Button variant="outline">Edit</Button>}
              onSubmit={() => refetch()}
            >
              <UpdateMeasurementCategoryForm
                measurementCategory={data.measurementCategory}
              />
            </FormSheet>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.measurementCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.measurementCategory.ageName}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.measurementCategory?.store?.presignedUrl && (
              <Image
                src={resolve(data.measurementCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6 h-full">
          {data.measurementCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.measurementCategory.bestQuery}
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
                <CreateGraphQueryForm category={data.measurementCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphMeasurementCategory.ModelPage>
    );
  },
);
