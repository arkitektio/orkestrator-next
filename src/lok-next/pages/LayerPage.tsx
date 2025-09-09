import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokLayer } from "@/linkers";
import {
  useDetailLayerQuery
} from "../api/graphql";
import ServiceInstanceCard from "../components/cards/ServiceInstanceCard";

export default asDetailQueryRoute(useDetailLayerQuery, ({ data }) => {
  const resolve = useResolve();

  return (
    <LokLayer.ModelPage
      object={data.layer.id}
      actions={<LokLayer.Actions object={data?.layer?.id} />}
      title={data?.layer?.name}
      sidebars={<LokLayer.Komments object={data?.layer?.id} />}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.layer.name}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.layer?.logo?.presignedUrl && (
                  <Image
                    src={resolve(data?.layer?.logo?.presignedUrl)}
                    className="my-auto"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-6 h-full">
        <h3>This layer hosts the following service instances</h3>
        <ListRender array={data?.layer?.instances}>
          {(item) => <ServiceInstanceCard item={item} />}
        </ListRender>
      </div>
    </LokLayer.ModelPage>
  );
});
