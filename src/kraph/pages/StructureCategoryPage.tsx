import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphStructureCategory } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { useGetStructureCategoryQuery } from "../api/graphql";

export default asDetailQueryRoute(
  useGetStructureCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useMediaUpload();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await refetch();
      }
    };

    const navigate = useNavigate();

    return (
      <KraphStructureCategory.ModelPage
        object={data.structureCategory.id}
        title={data?.structureCategory.label}
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
            <></>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.structureCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.structureCategory.ageName}
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
      </KraphStructureCategory.ModelPage>
    );
  },
);
