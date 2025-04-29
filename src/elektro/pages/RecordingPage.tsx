import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroRecording, ElektroSimulation, ElektroTrace } from "@/linkers";
import { useDetailRecordingQuery, useDetailSimulationQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { SimulationRender } from "../components/SImulationRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailRecordingQuery,
  ({ data, subscribeToMore }) => {
    const { renderView } = useTraceArray();


    return (
      <ElektroRecording.ModelPage
        title={data?.recording?.label}
        object={data.recording.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroRecording.ObjectButton object={data.recording.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroRecording.Komments object={data.recording.id} />,
            }}
          />
        }
      >
        <div className="flex flex-row gap-2">
          <div className="flex-1">
        <SimulationRender simulation={data.recording.simulation} highlight={[data.recording.id]} />
        </div>
        </div>
      </ElektroRecording.ModelPage>
    );
  },
);
