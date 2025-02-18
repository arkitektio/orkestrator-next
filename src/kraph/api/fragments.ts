
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Edge": [
      "ComputedMeasurement",
      "Measurement",
      "Relation"
    ],
    "Node": [
      "Entity",
      "Structure"
    ],
    "PathPairs": [
      "Pairs",
      "Path"
    ]
  }
};
      export default result;
    