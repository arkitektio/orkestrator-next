export const recordingViewToLabel = (view: {
  id: string;
  recording: { label: string };
}) => `r:${view.recording.label}${view.id}`;

export const stimulusViewToLabel = (view: {
  id: string;
  stimulus: { label: string };
}) => `s:${view.stimulus.label}${view.id}`;

export const getColorForRecordingView = (
  view: { id: string },
  highlight?: string,
) => {
  if (highlight && highlight === view.id) {
    return "hsl(45, 70%, 60%)";
  }

  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const getColorForStimulusView = (
  view: { id: string },
  highlight?: string,
) => {
  if (highlight && highlight === view.id) {
    return "hsl(45, 70%, 60%)";
  }

  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
