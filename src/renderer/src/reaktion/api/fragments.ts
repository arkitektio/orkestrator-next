
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
      "StateChoiceAssignWidget",
      "StringAssignWidget"
    ],
    "AssignableNode": [
      "RekuestFilterActionNode",
      "RekuestMapActionNode"
    ],
    "Effect": [
      "CustomEffect",
      "HideEffect",
      "MessageEffect"
    ],
    "GraphEdge": [
      "LoggingEdge",
      "VanillaEdge"
    ],
    "GraphNode": [
      "AgentSubFlowNode",
      "ArgNode",
      "ReactiveNode",
      "RekuestFilterActionNode",
      "RekuestMapActionNode",
      "ReturnNode"
    ],
    "RekuestActionNode": [
      "RekuestFilterActionNode",
      "RekuestMapActionNode"
    ],
    "RetriableNode": [
      "RekuestFilterActionNode",
      "RekuestMapActionNode"
    ],
    "ReturnWidget": [
      "ChoiceReturnWidget",
      "CustomReturnWidget"
    ]
  }
};
      export default result;
    