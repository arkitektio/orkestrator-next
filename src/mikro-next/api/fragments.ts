
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ImageMetric": [
      "ImageIntMetric"
    ],
    "IntMetric": [
      "ImageIntMetric"
    ],
    "ROI": [
      "PathROI",
      "RectangleROI"
    ],
    "Render": [
      "Snapshot",
      "Video"
    ],
    "RenderNode": [
      "ContextNode",
      "GridNode",
      "OverlayNode"
    ],
    "View": [
      "AcquisitionView",
      "AffineTransformationView",
      "ChannelView",
      "ContinousScanView",
      "LabelView",
      "OpticsView",
      "RGBView",
      "TimepointView",
      "WellPositionView"
    ]
  }
};
      export default result;
    