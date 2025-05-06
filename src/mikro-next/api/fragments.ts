
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Accessor": [
      "ImageAccessor",
      "LabelAccessor"
    ],
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
    "View": [
      "AcquisitionView",
      "AffineTransformationView",
      "ChannelView",
      "ContinousScanView",
      "DerivedView",
      "FileView",
      "HistogramView",
      "LabelView",
      "OpticsView",
      "PixelView",
      "RGBView",
      "ROIView",
      "ScaleView",
      "StructureView",
      "TimepointView",
      "WellPositionView"
    ]
  }
};
      export default result;
    