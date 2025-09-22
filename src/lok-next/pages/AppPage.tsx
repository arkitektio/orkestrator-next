import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokApp } from "@/linkers";
import { useDetailAppQuery } from "../api/graphql";
import ReleaseCard from "../components/cards/ReleaseCard";

export default asDetailQueryRoute(useDetailAppQuery, ({ data }) => {
  const resolve = useResolve();

  return (
    <LokApp.ModelPage
      object={data.app.id}
      actions={<LokApp.Actions object={data?.app?.id} />}
      title={data?.app?.identifier}
      sidebars={<LokApp.Komments object={data?.app?.id} />}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.app.identifier}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.app.logo && (
                  <Image
                    src={resolve(data?.app?.logo.presignedUrl)}
                    className="my-auto"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ListRender array={data?.app?.releases}>
        {(item) => <ReleaseCard item={item} />}
      </ListRender>
    </LokApp.ModelPage>
  );
});
