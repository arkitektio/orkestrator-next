import { useMemo } from "react";
import {
  DetailSimulationFragment,
  ExperimentFragment,
  ListRecordingFragment,
  ListStimulusFragment,
  RecordingFragment,
  StimulusFragment,
} from "../api/graphql";
import { ExperimentRender } from "./ExperimentRender";

export const getColorForRecording = (
  recording: ListRecordingFragment,
  highlight?: string[],
) => {
  const hue =
    highlight == undefined
      ? (parseInt(recording.id) * 137.508) % 360
      : highlight.includes(recording.id)
        ? 0
        : (parseInt(recording.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const getColorForStimulus = (
  stimulus: ListStimulusFragment,
  highlight?: string[],
) => {
  const hue =
    highlight == undefined
      ? (parseInt(stimulus.id) * 37.508) % 360
      : highlight.includes(stimulus.id)
        ? 0
        : (parseInt(stimulus.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const recordingToID = (rec: RecordingFragment) => `r:${rec.label}`;
export const stimulusToID = (s: StimulusFragment) => `s:${s.label}`;

export const recordingToLabel = (rec: RecordingFragment) => rec.label;
export const stimulusToLabel = (rec: StimulusFragment) => rec.label;

/**
 * Adapt a simulation (flat `recordings` / `stimuli`) into the experiment shape
 * (`recordingViews` / `stimulusViews`) so it can be drawn by the shared,
 * uPlot-based ExperimentRender. Each recording/stimulus becomes a view whose
 * `id` is the underlying recording/stimulus id — matching what the simulation
 * pages pass for `hidden` / `hiddenStimuli` / `highlight`.
 */
const simulationToExperiment = (
  simulation: DetailSimulationFragment,
): ExperimentFragment => ({
  __typename: "Experiment",
  id: simulation.id,
  name: simulation.name,
  description: null,
  createdAt: simulation.createdAt,
  timeTrace: simulation.timeTrace,
  recordingViews: simulation.recordings.map((recording) => ({
    __typename: "ExperimentRecordingView",
    id: recording.id,
    label: recording.label,
    recording,
  })),
  stimulusViews: simulation.stimuli.map((stimulus) => ({
    __typename: "ExperimentStimulusView",
    id: stimulus.id,
    label: stimulus.label,
    stimulus,
  })),
});

export const SimulationRender = (props: {
  simulation: DetailSimulationFragment;
  highlight?: string[];
  hidden?: string[];
  hiddenStimuli?: string[];
}) => {
  const experiment = useMemo(
    () => simulationToExperiment(props.simulation),
    [props.simulation],
  );

  return (
    <ExperimentRender
      experiment={experiment}
      highlight={props.highlight?.[0]}
      hidden={props.hidden}
      hiddenStimuli={props.hiddenStimuli}
    />
  );
};
