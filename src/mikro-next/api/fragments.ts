
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
      "DerivedView",
      "FileView",
      "LabelView",
      "OpticsView",
      "RGBView",
      "ROIView",
      "ScaleView",
      "SpecimenView",
      "TimepointView",
      "WellPositionView"
    ]
  }
};
      export default result;
    