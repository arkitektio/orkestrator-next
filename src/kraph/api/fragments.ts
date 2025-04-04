
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
      "StructureCategory"
    ],
    "CategoryDefintion": [
      "EntityCategoryDefinition",
      "ReagentCategoryDefinition",
      "StructureCategoryDefinition"
    ],
    "Edge": [
      "Description",
      "Measurement",
      "Participant",
      "Relation"
    ],
    "EdgeCategory": [
      "MeasurementCategory",
      "RelationCategory"
    ],
    "Node": [
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
    "PairsPathTable": [
      "Pairs",
      "Path",
      "Table"
    ],
    "PathPairsTable": [
      "Pairs",
      "Path",
      "Table"
    ]
  }
};
      export default result;
    