import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ElektroRecording,
  ElektroSimulation,
  ElektroStimulus,
} from "@/linkers";
import { cn } from "@udecode/cn";
import React from "react";
import { useDetailSimulationQuery } from "../api/graphql";
import { NeuronSimulationVisualizer } from "../components/NeuronSimulationRender";
import {
  getColorForRecording,
  getColorForStimulus,
  recordingToLabel,
  SimulationRender,
  stimulusToLabel,
} from "../components/SImulationRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailSimulationQuery,
  ({ data, subscribeToMore }) => {
    const [show, setShow] = React.useState(false);
    const [hidden, setHidden] = React.useState<string[]>([]);
    const [hiddenStimuli, setHiddenStimuli] = React.useState<string[]>([]);

    return (
      <ElektroSimulation.ModelPage
        variant="black"
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
              Comments: (
                <ElektroSimulation.Komments object={data.simulation.id} />
              ),
            }}
          />
        }
      >
        <div className="flex h-full w-full flex flex-col gap-2">
          <div className="flex-initial grid grid-cols-12 gap-2">
            <div className="col-span-11 h-32 p-3">
              <div>
                <h1 className="scroll-m-16 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {data.simulation.name}
                </h1>
                <p className="mt-3 text-xl text-muted-foreground">
                  Duration: {data.simulation.duration} ms dt:{" "}
                  {data.simulation.dt} s/ms
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShow(!show)}
                    >
                      <span className="text-xs">
                        {!show ? "Show Model" : "Hide"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] h-[500px]">
                    <NeuronSimulationVisualizer simulation={data.simulation} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex-grow w-full gap-2 flex">
            <SimulationRender
              simulation={data.simulation}
              hidden={hidden}
              hiddenStimuli={hiddenStimuli}
            />
          </div>
          <div className="flex-initial flex flex-row gap-2 mb-6">
            {data.simulation.recordings.map((view, index) => (
              <Card
                className={cn(
                  "px-2 flex-1 cursor-pointer max-w-xs p-3",
                  hidden.includes(view.id) && "opacity-20",
                )}
                key={index}
                onClick={() => {
                  setHidden((prev) =>
                    prev.find((x) => x === view.id)
                      ? prev.filter((x) => x !== view.id)
                      : [...prev, view.id],
                  );
                }}
              >
                <div className="flex flex-row gap-2 my-auto">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getColorForRecording(view) }}
                  />
                  <div className="text-sm text-muted-foreground my-auto">
                    {recordingToLabel(view)}
                  </div>
                  <ElektroRecording.DetailLink
                    object={view.id}
                    className="text-sm text-muted-foreground my-auto"
                  >
                    {" "}
                    Open{" "}
                  </ElektroRecording.DetailLink>
                </div>
              </Card>
            ))}
            {data.simulation.stimuli.map((view, index) => (
              <Card
                className={cn(
                  "px-2 flex-1 cursor-pointer max-w-xs p-3",
                  hiddenStimuli.includes(view.id) && "opacity-20",
                )}
                key={index}
                onClick={() => {
                  setHiddenStimuli((prev) =>
                    prev.find((x) => x === view.id)
                      ? prev.filter((x) => x !== view.id)
                      : [...prev, view.id],
                  );
                }}
              >
                <div className="flex flex-row gap-2 my-auto">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getColorForStimulus(view) }}
                  />
                  <div className="text-sm text-muted-foreground my-auto">
                    {stimulusToLabel(view)}
                  </div>
                  <ElektroStimulus.DetailLink
                    object={view.id}
                    className="text-sm text-muted-foreground my-auto"
                  >
                    {" "}
                    Open{" "}
                  </ElektroStimulus.DetailLink>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ElektroSimulation.ModelPage>
    );
  },
);
