
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
      "PixelView",
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
    