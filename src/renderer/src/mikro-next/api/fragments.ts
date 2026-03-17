
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
    "OpticalElement": [
      "BeamSplitterElement",
      "CCDElement",
      "DetectorElement",
      "FilterElement",
      "LampElement",
      "LaserElement",
      "LensElement",
      "MirrorElement",
      "ObjectiveElement",
      "OtherElement",
      "OtherSourceElement",
      "PinholeElement",
      "SampleElement"
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
      "InstanceMaskView",
      "LabelView",
      "LightpathView",
      "MaskView",
      "OpticsView",
      "RGBView",
      "ROIView",
      "ReferenceView",
      "ScaleView",
      "TimepointView",
      "WellPositionView"
    ],
    "_Entity": [
      "AcquisitionView",
      "AffineTransformationView",
      "BigFileStore",
      "Camera",
      "ChannelView",
      "Client",
      "ContinousScanView",
      "Dataset",
      "DerivedView",
      "Era",
      "Experiment",
      "File",
      "FileView",
      "HistogramView",
      "Image",
      "ImageAccessor",
      "InstanceMaskView",
      "Instrument",
      "LabelAccessor",
      "LabelView",
      "LightpathView",
      "MaskView",
      "MediaStore",
      "Membership",
      "Mesh",
      "MultiWellPlate",
      "Objective",
      "OpticsView",
      "Organization",
      "ParquetStore",
      "RGBContext",
      "RGBView",
      "ROI",
      "ROIView",
      "ReferenceView",
      "RenderTree",
      "ScaleView",
      "Snapshot",
      "Stage",
      "Table",
      "TimepointView",
      "User",
      "Video",
      "ViewCollection",
      "WellPositionView",
      "ZarrStore"
    ]
  }
};
      export default result;
    