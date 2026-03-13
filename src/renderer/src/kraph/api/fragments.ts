
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Category": [
      "EntityCategory",
      "MeasurementCategory",
      "MetricCategory",
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "RelationCategory",
      "StructureCategory",
      "StructureRelationCategory"
    ],
    "Edge": [
      "Assertion",
      "Description",
      "InputParticipation",
      "Measurement",
      "OutputParticipation",
      "Relation",
      "StructureRelation"
    ],
    "EdgeCategory": [
      "MeasurementCategory",
      "RelationCategory",
      "StructureRelationCategory"
    ],
    "EdgeQuery": [
      "EdgePairsQuery",
      "EdgePathQuery",
      "EdgeTableQuery"
    ],
    "Event": [
      "NaturalEvent",
      "ProtocolEvent"
    ],
    "EventCategory": [
      "NaturalEventCategory",
      "ProtocolEventCategory"
    ],
    "GraphQuery": [
      "GraphNodesQuery",
      "GraphPairsQuery",
      "GraphPathQuery",
      "GraphTableQuery"
    ],
    "Node": [
      "Activity",
      "Entity",
      "MeasurementShadowLink",
      "Metric",
      "NaturalEvent",
      "ProtocolEvent",
      "RelationShadowLink",
      "Structure",
      "StructureRelationShadowLink"
    ],
    "NodeCategory": [
      "EntityCategory",
      "MetricCategory",
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "StructureCategory"
    ],
    "NodeQuery": [
      "NodePairsQuery",
      "NodePathQuery",
      "NodeTableQuery"
    ],
    "PathLike": [
      "GraphPathRender"
    ],
    "Plottable": [
      "EdgeTableQuery",
      "GraphTableQuery",
      "NodeTableQuery"
    ],
    "VersionedNode": [
      "Entity",
      "NaturalEvent",
      "ProtocolEvent"
    ],
    "_Entity": [
      "CategoryTag",
      "EdgePairsQuery",
      "EdgePathQuery",
      "EdgeTableQuery",
      "EntityCategory",
      "Graph",
      "GraphNodesQuery",
      "GraphPairsQuery",
      "GraphPathQuery",
      "GraphTableQuery",
      "MaterializedEdge",
      "MeasurementCategory",
      "MediaStore",
      "MetricCategory",
      "NaturalEventCategory",
      "NodePairsQuery",
      "NodePathQuery",
      "NodeTableQuery",
      "ProtocolEventCategory",
      "RelationCategory",
      "ScatterPlot",
      "StructureCategory",
      "StructureRelationCategory"
    ]
  }
};
      export default result;
    