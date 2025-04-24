import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroExperiment, ElektroSimulation, ElektroTrace } from "@/linkers";
import { useDetailExperimentQuery, useDetailSimulationQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { SimulationRender } from "../components/SImulationRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";
import { ExperimentRender } from "../components/ExperimentRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailExperimentQuery,
  ({ data, subscribeToMore }) => {
    const { renderView } = useTraceArray();


    return (
      <ElektroExperiment.ModelPage
        title={data?.experiment?.name}
        object={data.experiment.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroExperiment.ObjectButton object={data.experiment.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroExperiment.Komments object={data.experiment.id} />,
            }}
          />
        }
      >
        <div className="flex flex-row gap-2">
          <div className="flex-1">
        <ExperimentRender experiment={data.experiment} />
        </div>
        </div>
      </ElektroExperiment.ModelPage>
    );
  },
);
