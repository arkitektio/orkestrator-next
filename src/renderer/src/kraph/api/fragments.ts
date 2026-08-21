
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
    "ClaimEndpoint": [
      "Instance",
      "Link",
      "Structure",
      "Term"
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
    "Event": [
      "NaturalEvent",
      "ProtocolEvent"
    ],
    "EventCategory": [
      "NaturalEventCategory",
      "ProtocolEventCategory"
    ],
    "GraphQuery": [
      "GraphTableQuery"
    ],
    "InformsTarget": [
      "Entity",
      "Link",
      "NaturalEvent",
      "ProtocolEvent"
    ],
    "Node": [
      "Entity",
      "NaturalEvent",
      "ProtocolEvent"
    ],
    "NodeCategory": [
      "EntityCategory",
      "NaturalEventCategory",
      "ProtocolEventCategory"
    ],
    "Plottable": [
      "GraphTableQuery"
    ],
    "_Entity": [
      "Assertion",
      "BigFileStore",
      "Comment",
      "EntityCategory",
      "Graph",
      "GraphTableQuery",
      "Instance",
      "Link",
      "MeasurementCategory",
      "MediaStore",
      "MetricKind",
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "RelationCategory",
      "ScatterPlot",
      "Standing",
      "StructureKind",
      "StructureRelationCategory",
      "Term",
      "ZarrStore"
    ]
  }
};
      export default result;
    