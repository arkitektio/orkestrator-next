import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroSimulation, ElektroTrace } from "@/linkers";
import { useDetailSimulationQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { SimulationRender } from "../components/SImulationRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailSimulationQuery,
  ({ data, subscribeToMore }) => {
    const { renderView } = useTraceArray();


    return (
      <ElektroSimulation.ModelPage
        title={data?.simulation?.name}
        object={data.simulation.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroSimulation.ObjectButton object={data.simulation.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroSimulation.Komments object={data.simulation.id} />,
            }}
          />
        }
      >
        <div className="flex flex-row gap-2">
          <div className="flex-1">
        <SimulationRender simulation={data.simulation} />
        </div>
          <div className="flex-1" >
        <NeuronVisualizer model={data.simulation.model} />
        </div>
        </div>
      </ElektroSimulation.ModelPage>
    );
  },
);
