import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import {
  ElektroAnalogSignal,
  ElektroAnalogSignalChannel,
  ElektroStimulus,
} from "@/linkers";
import {
  useDetailAnalogSignalChannelQuery,
  useDetailStimulusQuery,
} from "../api/graphql";
import { SimulationRender } from "../components/SImulationRender";
import { useTraceArray } from "../lib/useTraceArray";
import { AnalogSignalRender } from "../components/AnalogSignalRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailAnalogSignalChannelQuery,
  ({ data, subscribeToMore }) => {
    return (
      <ElektroAnalogSignalChannel.ModelPage
        variant="black"
        title={data?.analogSignalChannel?.name}
        object={data.analogSignalChannel.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroAnalogSignalChannel.ObjectButton
              object={data.analogSignalChannel.id}
            />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <ElektroAnalogSignalChannel.Komments
                  object={data.analogSignalChannel.id}
                />
              ),
            }}
          />
        }
      >
        <div className="flex-initial grid grid-cols-12 gap-2">
          <div className="col-span-10 h-32 p-3">
            <div>
              <h1 className="scroll-m-16 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {data.analogSignalChannel.name}
              </h1>
              <ElektroAnalogSignal.DetailLink
                object={data.analogSignalChannel.signal.id}
                className="mt-3 text-xl text-muted-foreground"
              >
                {data.analogSignalChannel.index} in{" "}
                {data.analogSignalChannel.signal.name}
              </ElektroAnalogSignal.DetailLink>
            </div>
          </div>
          <div className="col-span-2 px-3 h-10 flex flex-row gap-2 mb-6">
            <ElektroAnalogSignalChannel.TinyKnowledge
              object={data.analogSignalChannel.id}
            />
          </div>
        </div>

        <div className="flex-grow w-full gap-2 flex mt-40">
          <AnalogSignalRender
            signal={data.analogSignalChannel.signal}
            highlight={data.analogSignalChannel.id}
          />
        </div>
      </ElektroAnalogSignalChannel.ModelPage>
    );
  },
);
