import React, { useMemo } from "react";
import {
  DetailSimulationFragment,
  ExperimentFragment,
} from "../api/graphql";
import { ExperimentRender } from "./ExperimentRender";
import {
  getColorForRecordingView,
  getColorForStimulusView,
} from "./ExperimentRender.utils";
import { RangeSelection } from "./store/experimentViewerStore";

// ─── Convenience helpers ──────────────────────────────────────────────────────
// These are exported for consumers (legend cards, 3D markers) that need colours
// and labels for flat recording/stimulus objects (not wrapped view objects).

export const getColorForRecording = (
  r: { id: string },
  highlight?: string[],
): string => {
  if (highlight?.includes(r.id)) {
    return "hsl(45, 70%, 60%)";
  }
  return getColorForRecordingView(r);
};

export const getColorForStimulus = (
  s: { id: string },
  highlight?: string[],
): string => {
  if (highlight?.includes(s.id)) {
    return "hsl(45, 70%, 60%)";
  }
  return getColorForStimulusView(s);
};

export const recordingToLabel = (r: { label: string }): string => r.label;
export const stimulusToLabel = (s: { label: string }): string => s.label;

export type SimulationRenderProps = {
  simulation: DetailSimulationFragment;
  hidden?: string[];
  hiddenStimuli?: string[];
  highlight?: string;
  selectedRange?: RangeSelection;
  onSelectedRangeChange?: (range: RangeSelection) => void;
};

/**
 * Adapt a DetailSimulationFragment into the ExperimentFragment shape so
 * SimulationRender can reuse all the same viewer infrastructure.
 *
 * Simulation has flat recordings[] / stimuli[].
 * ExperimentFragment expects recordingViews[{ id, label, recording }] / stimulusViews[{ id, label, stimulus }].
 */
const adaptSimulationToExperiment = (
  sim: DetailSimulationFragment,
): ExperimentFragment => ({
  __typename: "Experiment",
  id: sim.id,
  name: sim.name,
  description: null,
  createdAt: sim.createdAt,
  timeTrace: sim.timeTrace,
  recordingViews: sim.recordings.map((recording) => ({
    __typename: "ExperimentRecordingView",
    id: recording.id,
    label: recording.label,
    recording,
  })),
  stimulusViews: sim.stimuli.map((stimulus) => ({
    __typename: "ExperimentStimulusView",
    id: stimulus.id,
    label: stimulus.label,
    stimulus,
  })),
});

export const SimulationRender: React.FC<SimulationRenderProps> = ({
  simulation,
  ...props
}) => {
  const experiment = useMemo(
    () => adaptSimulationToExperiment(simulation),
    [simulation],
  );

  return <ExperimentRender experiment={experiment} {...props} />;
};
