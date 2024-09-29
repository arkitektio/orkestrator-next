
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "DatasetImageFile": [
      "Dataset",
      "File",
      "Image"
    ],
    "Plot": [
      "RenderedPlot"
    ],
    "Render": [
      "Snapshot",
      "Video"
    ],
    "RenderNode": [
      "ContextNode",
      "GridNode",
      "OverlayNode",
      "SplitNode"
    ],
    "View": [
      "AcquisitionView",
      "AffineTransformationView",
      "ChannelView",
      "ContinousScanView",
      "LabelView",
      "OpticsView",
      "ProtocolStepView",
      "RGBView",
      "ScaleView",
      "SpecimenView",
      "TimepointView",
      "WellPositionView"
    ]
  }
};
      export default result;
    