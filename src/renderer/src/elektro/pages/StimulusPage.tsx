import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroStimulus } from "@/linkers";
import { useDetailStimulusQuery } from "../api/graphql";
import { SimulationRender } from "../components/SImulationRender";
import { useTraceArray } from "../lib/useTraceArray";

export type IRepresentationScreenProps = {};

export const StimulusPage = asDetailQueryRoute(
  useDetailStimulusQuery,
  ({ data, subscribeToMore }) => {
    const { renderView } = useTraceArray();


    return (
      <ElektroStimulus.ModelPage
        title={data?.stimulus?.label}
        object={data.stimulus}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroStimulus.ObjectButton object={data.stimulus} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroStimulus.Komments object={data.stimulus} />,
            }}
          />
        }
      >
        <div className="flex flex-row gap-2 h-full w-full">
          <div className="flex-1">
            <SimulationRender simulation={data.stimulus.simulation} highlight={[data.stimulus.id]} />
          </div>
        </div>
      </ElektroStimulus.ModelPage>
    );
  },
);

export default StimulusPage;
