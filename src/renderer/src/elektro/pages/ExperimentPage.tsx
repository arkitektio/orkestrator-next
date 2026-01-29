import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import {
  ElektroExperiment,
  ElektroRecording,
  ElektroStimulus,
} from "@/linkers";
import { cn } from "@udecode/cn";
import React from "react";
import { useDetailExperimentQuery } from "../api/graphql";
import {
  ExperimentRender,
  getColorForRecordingView,
  getColorForStimulusView,
  recordingViewToLabel,
  stimulusViewToLabel,
} from "../components/ExperimentRender";
import Timestamp from "react-timestamp";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailExperimentQuery,
  ({ data, subscribeToMore }) => {
    const [show, setShow] = React.useState(false);
    const [hidden, setHidden] = React.useState<string[]>([]);
    const [hiddenStimuli, setHiddenStimuli] = React.useState<string[]>([]);

    return (
      <ElektroExperiment.ModelPage
        variant="black"
        title={data?.experiment?.name}
        object={data?.experiment.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroExperiment.ObjectButton object={data.experiment.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <ElektroExperiment.Komments object={data.experiment.id} />
              ),
            }}
          />
        }
      >
        <div className="flex-initial grid grid-cols-12 gap-2 h-32 w-full">
          <div className="col-span-11 h-32 p-3">
            <div>
              <h1 className="scroll-m-16 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {data.experiment.name}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">
                {data.experiment.description} <Timestamp date={new Date(data.experiment.createdAt)} autoUpdate />
              </p>
            </div>
          </div>
        </div>
        <div className="flex-grow w-full flex overflow-hidden">
          <ExperimentRender
            experiment={data.experiment}
            hidden={hidden}
            hiddenStimuli={hiddenStimuli}
          />
        </div>
        <div className="flex-initial flex flex-row gap-2 mb-6">
          {data.experiment.recordingViews.map((view, index) => (
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
                  style={{ backgroundColor: getColorForRecordingView(view) }}
                />
                <div className="text-sm text-muted-foreground my-auto truncate">
                  {recordingViewToLabel(view)}
                </div>
                <ElektroRecording.DetailLink
                  object={view.recording.id}
                  className="text-sm text-muted-foreground my-auto truncate"
                >
                  Open
                </ElektroRecording.DetailLink>
              </div>
            </Card>
          ))}
          {data.experiment.stimulusViews.map((view, index) => (
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
                  style={{ backgroundColor: getColorForStimulusView(view) }}
                />
                <div className="text-sm text-muted-foreground my-auto">
                  {stimulusViewToLabel(view)}
                </div>
                <ElektroStimulus.DetailLink
                  object={view.stimulus.id}
                  className="text-sm text-muted-foreground my-auto truncate"
                >
                  Open
                </ElektroStimulus.DetailLink>
              </div>
            </Card>
          ))}
        </div>
      </ElektroExperiment.ModelPage>
    );
  },
);
