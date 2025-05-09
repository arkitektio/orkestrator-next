import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroRecording, ElektroSimulation, ElektroStimulus, ElektroTrace } from "@/linkers";
import { useDetailRecordingQuery, useDetailSimulationQuery, useDetailStimulusQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { SimulationRender } from "../components/SImulationRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailStimulusQuery,
  ({ data, subscribeToMore }) => {
    const { renderView } = useTraceArray();


    return (
      <ElektroStimulus.ModelPage
        title={data?.stimulus?.label}
        object={data.stimulus.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroStimulus.ObjectButton object={data.stimulus.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroStimulus.Komments object={data.stimulus.id} />,
            }}
          />
        }
      >
        <div className="flex flex-row gap-2">
          <div className="flex-1">
        <SimulationRender simulation={data.stimulus.simulation} highlight={[data.stimulus.id]} />
        </div>
        </div>
      </ElektroStimulus.ModelPage>
    );
  },
);
