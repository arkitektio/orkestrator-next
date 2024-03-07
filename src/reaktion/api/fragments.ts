
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
      "ArkitektFilterGraphNode",
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
      "ArkitektFilterGraphNode",
      "ArkitektGraphNode",
      "ReactiveNode",
      "ReturnNode"
    ],
    "RetriableNode": [
      "ArkitektFilterGraphNode",
      "ArkitektGraphNode"
    ],
    "ReturnWidget": [
      "ChoiceReturnWidget",
      "CustomReturnWidget"
    ]
  }
};
      export default result;
    