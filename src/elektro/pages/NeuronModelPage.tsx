import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroNeuronModel, ElektroTrace } from "@/linkers";
import { useDetailNeuronModelQuery, useDetailTraceQuery } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import { Button } from "@/components/ui/button";
import { TraceRender } from "../components/TraceRender";
import { NeuronVisualizer } from "../components/NeuronRenderer";

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
        <NeuronVisualizer model={data.neuronModel} />
      </ElektroNeuronModel.ModelPage>
    );
  },
);
