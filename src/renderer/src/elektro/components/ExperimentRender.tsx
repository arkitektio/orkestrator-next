import "uplot/dist/uPlot.min.css";
import React from "react";
import { ExperimentFragment } from "../api/graphql";
import { ExperimentDetailChart } from "./ExperimentDetailChart";
import { ExperimentHoverTooltip } from "./ExperimentHoverTooltip";
import { ExperimentOverviewChart } from "./ExperimentOverviewChart";
import { ExperimentRenderProvider } from "./ExperimentRenderProvider";
import { ExperimentViewerControls } from "./ExperimentViewerControls";
import { RangeSelection } from "./store/experimentViewerStore";

export type { RangeSelection };

export type ExperimentRenderProps = {
  experiment: ExperimentFragment;
  highlight?: string;
  hidden?: string[];
  hiddenStimuli?: string[];
  selectedRange?: RangeSelection;
  onSelectedRangeChange?: (range: RangeSelection) => void;
};

export const ExperimentRender: React.FC<ExperimentRenderProps> = (props) => {
  return (
    <ExperimentRenderProvider {...props}>
      <div className="relative flex h-full min-h-[32rem] w-full flex-col gap-2 overflow-hidden">
        <ExperimentDetailChart />
        <ExperimentOverviewChart />
        <ExperimentHoverTooltip />
        <ExperimentViewerControls />
      </div>
    </ExperimentRenderProvider>
  );
};
