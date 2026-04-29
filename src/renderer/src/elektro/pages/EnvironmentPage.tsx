import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Card } from "@/components/ui/card";
import { ElektroEnvironment, ElektroMechanism } from "@/linkers";
import { useDetailModEnvironmentQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export const EnvironmentPage = asDetailQueryRoute(
  useDetailModEnvironmentQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroEnvironment.ModelPage
        variant="black"
        title={data?.modEnvironment?.name}
        object={data.modEnvironment}
      >
        <div className="h-full w-full grid grid-cols-12 grid-reverse gap-4 pointers-events-none p-4 ">

          <div className="col-span-3  @container bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden flex flex-col ">

            <div className=" p-3">
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {data.modEnvironment.name}
                </h1>
                <p className="mt-3 text-xl text-muted-foreground">
                  {data.modEnvironment.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-3">
              {data.modEnvironment.mechanisms.map((mech) => (
                <Card className="col-span-1 p-4"  key={mech.id}>
                  <ElektroMechanism.DetailLink object={mech} className={"font-light text-xs"}>
                    {mech.name}

                  </ElektroMechanism.DetailLink>

                </Card>
              ))}
            </div>


          </div>

        </div>

      </ElektroEnvironment.ModelPage>
    );
  },
);

export default EnvironmentPage;
