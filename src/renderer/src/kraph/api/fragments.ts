
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
    "Descendant": [
      "LeafDescendant",
      "MentionDescendant",
      "ParagraphDescendant"
    ],
    "Edge": [
      "Classification",
      "Description",
      "InputParticipation",
      "Measurement",
      "OutputParticipation",
      "Relation",
      "Sameness",
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
      "Metric",
      "NaturalEvent",
      "ProtocolEvent",
      "Structure"
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
      "Assertion",
      "BigFileStore",
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
      "Term",
      "ZarrStore"
    ]
  }
};
      export default result;
    