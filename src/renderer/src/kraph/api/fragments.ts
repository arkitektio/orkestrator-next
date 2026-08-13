
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
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "RelationCategory",
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
      "NaturalEventCategory",
      "ProtocolEventCategory"
    ],
    "NodeQuery": [
      "NodePairsQuery",
      "NodePathQuery",
      "NodeTableQuery"
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
      "BigFileStore",
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
      "MaterializedMeasurementEdge",
      "MaterializedRelationEdge",
      "MaterializedStructureRelationEdge",
      "MeasurementCategory",
      "MediaStore",
      "MetricKind",
      "NaturalEventCategory",
      "NodePairsQuery",
      "NodePathQuery",
      "NodeTableQuery",
      "ProtocolEventCategory",
      "RelationCategory",
      "ScatterPlot",
      "StructureKind",
      "StructureRelationCategory",
      "ZarrStore"
    ]
  }
};
      export default result;
    