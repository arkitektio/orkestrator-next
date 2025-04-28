import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroModelCollection, ElektroNeuronModel, ElektroTrace } from "@/linkers";
import { useDetailNeuronModelQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";
import { Card } from "@/components/ui/card";
import SimulationCard from "../components/cards/SimulationCard";
import { valueFromAST } from "graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailNeuronModelQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroNeuronModel.ModelPage
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
        
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6 h-96">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {data.neuronModel.name}
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    {data.neuronModel.name}
                  </p>
                </div>
                <Card className="w-full h-full flex-row relative">
                <NeuronVisualizer model={data.neuronModel} />
                </Card>
              </div>

        <div className="grid grid-cols-6 gap-4">
          {data.neuronModel.comparisons.map((comparison) => (
            <Card className="col-span-1 p-4">
              <ElektroModelCollection.DetailLink object={comparison.collection.id}>
                  {comparison.collection.name}
               
              </ElektroModelCollection.DetailLink>
              {comparison.changes.map((change) => (
                <div className="flex flex-col gap-2">
                  <div className="flex-1">
                    {change.path.join(".")}
                  </div>
                  <div className="flex-1">
                    Self: {JSON.stringify(change.valueA)}
                    </div>
                    <div className="flex-1">
                    Other:  {JSON.stringify(change.valueA)}
                    </div>
                  <div className="flex-1">
                    {change.type}
                    </div>
                  </div>
              ))}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-4">
          {data.neuronModel.simulations.map((comparison) => (
            <SimulationCard item={comparison} />
          ))}
        </div>
       
      </ElektroNeuronModel.ModelPage>
    );
  },
);
