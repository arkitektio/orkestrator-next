import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import { ElektroModelCollection, ElektroNeuronModel } from "@/linkers";
import { useDetailNeuronModelQuery } from "../api/graphql";
import SimulationCard from "../components/cards/SimulationCard";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailNeuronModelQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroNeuronModel.ModelPage
        variant="black"
        title={data?.neuronModel?.name}
        object={data.neuronModel.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroNeuronModel.ObjectButton object={data.neuronModel.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroNeuronModel.Komments object={data.neuronModel.id} />,
            }}
          />
        }
      >
        <div className="h-full w-full grid grid-cols-12 grid-reverse gap-4 pointers-events-none">

          <div className="col-span-3  @container p-4 bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden flex flex-col ">

            <div className="h-32 p-3">
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {data.neuronModel.name}
                </h1>
                <p className="mt-3 text-xl text-muted-foreground">
                  {data.neuronModel.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data.neuronModel.comparisons.map((comparison) => (
                <Card className="col-span-1 p-4">
                  <ElektroModelCollection.DetailLink object={comparison.collection.id} className={"font-light text-xs"}>
                    {comparison.collection.name}

                  </ElektroModelCollection.DetailLink>
                  {comparison.changes.map((change) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex-1 font-light">
                        {change.path.join(".")}
                      </div>
                      <div className="flex-1">
                        {JSON.stringify(change.valueA)} -  {JSON.stringify(change.valueB)}
                      </div>

                    </div>
                  ))}
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {data.neuronModel.simulations.map((comparison) => (
                <SimulationCard item={comparison} />
              ))}
            </div>
          </div>
          <div className="col-span-9">
            <NeuronVisualizer model={data.neuronModel} />
          </div>

        </div>

      </ElektroNeuronModel.ModelPage>
    );
  },
);
