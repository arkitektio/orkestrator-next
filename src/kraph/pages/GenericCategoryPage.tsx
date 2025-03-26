import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphGenericCategory, KraphStructureCategory } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { useGetGenericCategoryQuery, useGetStructureCategoryQuery, useUpdateGenericCategoryMutation } from "../api/graphql";
import { FormSheet } from "@/components/dialog/FormDialog";
import { ArrowDownToDotIcon } from "lucide-react";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";

export default asDetailQueryRoute(
  useGetGenericCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateGenericCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.genericCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    const navigate = useNavigate();

    return (
      <KraphGenericCategory.ModelPage
        object={data.genericCategory.id}
        title={data?.genericCategory.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphStructureCategory.Komments
                  object={data.genericCategory.id}
                />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.genericCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.genericCategory.ageName}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.genericCategory?.store?.presignedUrl && (
              <Image
                src={resolve(data.genericCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />
      </KraphGenericCategory.ModelPage>
    );
  },
);
