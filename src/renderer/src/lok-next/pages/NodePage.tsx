import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient } from "@/linkers";
import { useDetailClientQuery } from "../api/graphql";
import CompositionGraph from "../components/graphs/CompositionGraph";

export default asDetailQueryRoute(useDetailClientQuery, ({ data }) => {
  const resolve = useResolve();

  return (
    <LokClient.ModelPage
      object={data.client.id}
      actions={<LokClient.Actions object={data?.client?.id} />}
      title={data?.client?.release.app.identifier}
      sidebars={<LokClient.Komments object={data?.client?.id} />}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.client.release.app.identifier}:{" "}
              {data.client.release.version} @ {data.client.user?.username}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <div>
              <div className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.client.logo?.presignedUrl && (
                  <Image
                    src={resolve(data?.client?.logo.presignedUrl)}
                    className="my-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 h-full">
        <h3>This app is configured to use the following services</h3>
        <CompositionGraph client={data.client} />
      </div>
    </LokClient.ModelPage>
  );
});
