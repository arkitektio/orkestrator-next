import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
import { ElektroStimulus } from "@/linkers";
import { useDetailStimulusQuery } from "../api/graphql";
import { SimulationRender } from "../components/SimulationRender";

export type IRepresentationScreenProps = {};

export const StimulusPage = asDetailQueryRoute(
  useDetailStimulusQuery,
  ({ data }) => {
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
          <Sidebars>
            <Sidebars.Tab label="Comments">
              <ElektroStimulus.Komments object={data.stimulus} />
            </Sidebars.Tab>
          </Sidebars>
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
