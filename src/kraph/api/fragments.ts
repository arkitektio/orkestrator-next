
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Category": [
      "GenericCategory",
      "MeasurementCategory",
      "RelationCategory",
      "StepCategory",
      "StructureCategory"
    ],
    "Edge": [
      "ComputedMeasurement",
      "Measurement",
      "Relation"
    ],
    "EdgeCategory": [
      "MeasurementCategory",
      "RelationCategory",
      "StepCategory"
    ],
    "Node": [
      "Entity",
      "Structure"
    ],
    "NodeCategory": [
      "GenericCategory",
      "StructureCategory"
    ],
    "PairsPathTable": [
      "Pairs",
      "Path",
      "Table"
    ]
  }
};
      export default result;
    