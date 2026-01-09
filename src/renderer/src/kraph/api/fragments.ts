
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "BaseCategory": [
      "EntityCategory",
      "MeasurementCategory",
      "MetricCategory",
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "ReagentCategory",
      "RelationCategory",
      "StructureCategory",
      "StructureRelationCategory"
    ],
    "CategoryDefintion": [
      "EntityCategoryDefinition",
      "ReagentCategoryDefinition",
      "StructureCategoryDefinition"
    ],
    "Edge": [
      "Description",
      "Edited",
      "Measurement",
      "Participant",
      "Relation",
      "StructureRelation"
    ],
    "EdgeCategory": [
      "MeasurementCategory",
      "RelationCategory",
      "StructureRelationCategory"
    ],
    "Node": [
      "EditEvent",
      "Entity",
      "Metric",
      "NaturalEvent",
      "ProtocolEvent",
      "Reagent",
      "Structure"
    ],
    "NodeCategory": [
      "EntityCategory",
      "MetricCategory",
      "NaturalEventCategory",
      "ProtocolEventCategory",
      "ReagentCategory",
      "StructureCategory"
    ],
    "PairsPathTableNodeList": [
      "NodeList",
      "Pairs",
      "Path",
      "Table"
    ],
    "PathPairsTable": [
      "Pairs",
      "Path",
      "Table"
    ],
    "PathPairsTableNodeList": [
      "NodeList",
      "Pairs",
      "Path",
      "Table"
    ]
  }
};
      export default result;
    