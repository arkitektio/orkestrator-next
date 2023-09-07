
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "AssignWidget": [
      "ChoiceAssignWidget",
      "CustomAssignWidget",
      "SearchAssignWidget",
      "SliderAssignWidget",
      "StringAssignWidget"
    ],
    "AssignableNode": [
      "ArkitektGraphNode"
    ],
    "Effect": [
      "CustomEffect",
      "MessageEffect"
    ],
    "GraphEdge": [
      "LoggingEdge",
      "VanillaEdge"
    ],
    "GraphNode": [
      "ArgNode",
      "ArkitektGraphNode",
      "ReactiveNode",
      "ReturnNode"
    ],
    "RetriableNode": [
      "ArkitektGraphNode"
    ],
    "ReturnWidget": [
      "ChoiceReturnWidget",
      "CustomReturnWidget"
    ]
  }
};
      export default result;
    