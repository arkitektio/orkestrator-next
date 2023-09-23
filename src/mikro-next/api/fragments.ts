
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
    "ROI": [],
    "Render": [
      "Snapshot",
      "Video"
    ],
    "View": [
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
    