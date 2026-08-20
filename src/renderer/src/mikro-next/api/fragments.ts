
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "FileLinkContainer": [
      "AnnotationCollection",
      "ArrayDataset",
      "MeshCollection",
      "TableDataset"
    ],
    "FolderChild": [
      "AnnotationCollection",
      "ArrayDataset",
      "File",
      "Folder",
      "MeshCollection",
      "TableDataset"
    ],
    "InViewSource": [
      "AnnotationCollection",
      "ArrayDataset",
      "MeshCollection",
      "TableDataset"
    ],
    "Layer": [
      "AnnotationLayer",
      "ImageLayer",
      "LabelLayer",
      "MeshLayer",
      "PointLayer",
      "TrackLayer"
    ],
    "LayerRenderNode": [
      "BlendNode",
      "ChannelSourceNode",
      "PhasorNode",
      "ProjectionNode"
    ],
    "OpticalElement": [
      "ApertureElement",
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
      "PolarizerElement",
      "SampleElement",
      "ShutterElement",
      "WaveplateElement"
    ],
    "Resident": [
      "AnnotationCollection",
      "ArrayDataset",
      "DataArray",
      "Lens",
      "MeshCollection",
      "TableDataset"
    ],
    "SampleStep": [
      "ArraySample",
      "MeshSample"
    ],
    "Transformation": [
      "AffineTransformation",
      "BijectionTransformation",
      "ByDimensionTransformation",
      "FieldTransformation",
      "IdentityTransformation",
      "MapAxisTransformation",
      "RotationTransformation",
      "ScaleTransformation",
      "SequenceTransformation",
      "TranslationTransformation",
      "UnmappableTransformation"
    ],
    "_Entity": [
      "AffineTransformation",
      "Animation",
      "AnimationWaypoint",
      "Annotation",
      "AnnotationCollection",
      "AnnotationLayer",
      "ArrayDataset",
      "Axis",
      "BigFileStore",
      "BijectionTransformation",
      "ByDimensionTransformation",
      "ChannelLabel",
      "Client",
      "Column",
      "CoordinateAnchor",
      "CoordinateSystem",
      "DataArray",
      "FabriksStore",
      "FieldTransformation",
      "File",
      "FileLink",
      "Folder",
      "IdentityTransformation",
      "ImageLayer",
      "LabelLayer",
      "Lens",
      "LightPath",
      "MapAxisTransformation",
      "MediaStore",
      "Membership",
      "MeshCollection",
      "MeshLayer",
      "OptikitState",
      "Organization",
      "ParquetStore",
      "PhasorCalibration",
      "PhasorHistogram",
      "PointLayer",
      "RotationTransformation",
      "ScaleTransformation",
      "Scene",
      "SceneSnapshot",
      "SequenceTransformation",
      "SparseArray",
      "SparseAxisReference",
      "SparseDataset",
      "SparseStore",
      "TableDataset",
      "Task",
      "TrackLayer",
      "TranslationTransformation",
      "UnmappableTransformation",
      "User",
      "ValueHistogram",
      "ZarrStore"
    ]
  }
};
      export default result;
    