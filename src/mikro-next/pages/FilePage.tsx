import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroFile, MikroImage } from "@/linkers";
import { useGetFileQuery, usePinStageMutation } from "../api/graphql";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { Download } from "lucide-react";
import { DownloadButton } from "@/components/ui/download-button";

export default asDetailQueryRoute(useGetFileQuery, ({ data, refetch }) => {
  const [pinStage] = usePinStageMutation();

  const downloadFile = () => {
    if (data?.file?.store.presignedUrl) {
      const url = resolve(data.file.store.presignedUrl);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.file.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resolve = useResolve();
  return (
    <MikroFile.ModelPage
      actions={<MikroFile.Actions object={data.file.id} />}
      object={data.file.id}
      title={data.file.name}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroFile.Komments object={data.file.id} />,
            Provenance: <ProvenanceSidebar items={data?.file.history} />,
          }}
        />
      }
      pageActions={
        <>
          <DownloadButton
            url={resolve(data.file.store.presignedUrl)}
            variant="outline"
          >
            Download
          </DownloadButton>
        </>
      }
    >
      <div className="flex flex-col gap-1 mb-3">
        <MikroFile.DetailLink object={data.file.id} className={"text-3xl"}>
          {data?.file?.name} @ {data.file.organization.slug}
        </MikroFile.DetailLink>
        <p>
          {data?.file?.store.bucket}/{data?.file?.store.key}
        </p>
      </div>
      <ListRender array={data?.file?.views} title="Converted Images">
        {(view, index) => (
          <MikroImage.Smart object={view.image?.id}>
            <div
              className={`relative rounded group text-white bg-center bg-background shadow-lg aspect-square rounded rounded-lg hover:bg-back-800 transition-all ease-in-out duration-200 group-hover:shadow-xl`}
            >
              {view.image.latestSnapshot?.store.presignedUrl && (
                <Image
                  src={resolve(view.image.latestSnapshot?.store.presignedUrl)}
                  style={{ filter: "brightness(0.7)" }}
                  className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
                />
              )}
              <div className="px-2 py-2 h-full w-full absolute rounded-lg rounded  top-0 left-0 bg-opacity-20  hover:bg-opacity-10 transition-all ease-in-out duration-200 flex flex-row break-all overflow-y-hidden">
                <div className="flex-col flex">
                  <MikroImage.DetailLink
                    className={({ isActive } /*  */) =>
                      "z-10 font-bold text-md mb-2 cursor-pointer " +
                      (isActive ? "text-primary-300" : "")
                    }
                    object={view.image.id}
                  >
                    {view.image?.name}
                  </MikroImage.DetailLink>
                  {view.seriesIdentifier && (
                    <Badge className="w-max-[30px]">
                      {view.seriesIdentifier}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </MikroImage.Smart>
        )}
      </ListRender>
    </MikroFile.ModelPage>
  );
});
