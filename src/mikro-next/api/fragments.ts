
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
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
      "RGBView",
      "ScaleView",
      "SpecimenView",
      "TimepointView",
      "WellPositionView"
    ]
  }
};
      export default result;
    