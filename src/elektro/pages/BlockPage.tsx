import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import {
  ElektroAnalogSignal,
  ElektroBlock,
  ElektroExperiment,
  ElektroRecording,
  ElektroStimulus,
} from "@/linkers";
import { cn } from "@udecode/cn";
import React from "react";
import { useDetailBlockQuery, useDetailExperimentQuery } from "../api/graphql";
import {
  ExperimentRender,
  getColorForRecordingView,
  getColorForStimulusView,
  recordingViewToLabel,
  stimulusViewToLabel,
} from "../components/ExperimentRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailBlockQuery,
  ({ data, subscribeToMore }) => {
    return (
      <ElektroBlock.ModelPage
        variant="black"
        title={data?.block?.name}
        object={data?.block.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroBlock.ObjectButton object={data.block.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroBlock.Komments object={data.block.id} />,
            }}
          />
        }
      >
        <div className="flex h-full w-full flex flex-col gap-2">
          <div className="flex-initial grid grid-cols-12 gap-2">
            <div className="col-span-11 h-32 p-3">
              <div>
                <h1 className="scroll-m-16 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {data.block.name}
                </h1>
                <p className="mt-3 text-xl text-muted-foreground">
                  {data.block.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-initial flex flex-row gap-2 mb-6">
            {data.block.segments.map((view, index) => (
              <Card
                className={cn("px-2 flex-1 cursor-pointer max-w-xs p-3")}
                key={index}
              >
                <div className="flex flex-row gap-2 my-auto">
                  <div className="text-sm text-muted-foreground my-auto truncate">
                    {view.id} - {view.analogSignals.length} Signals
                  </div>
                  {view.analogSignals.map((x) => (
                    <ElektroAnalogSignal.DetailLink
                      key={x.id}
                      object={x.id}
                      className="text-sm text-muted-foreground my-auto truncate"
                    >
                      Open {x.id}
                    </ElektroAnalogSignal.DetailLink>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ElektroBlock.ModelPage>
    );
  },
);
