export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    AssignWidget: [
      "ChoiceAssignWidget",
      "CustomAssignWidget",
      "SearchAssignWidget",
      "SliderAssignWidget",
      "StateChoiceAssignWidget",
      "StringAssignWidget",
    ],
    AssignableNode: ["RekuestFilterNode", "RekuestMapNode"],
    Effect: ["CustomEffect", "MessageEffect"],
    GraphEdge: ["LoggingEdge", "VanillaEdge"],
    GraphNode: [
      "ArgNode",
      "ReactiveNode",
      "RekuestFilterNode",
      "RekuestMapNode",
      "ReturnNode",
    ],
    RekuestNode: ["RekuestFilterNode", "RekuestMapNode"],
    RetriableNode: ["RekuestFilterNode", "RekuestMapNode"],
    ReturnWidget: ["ChoiceReturnWidget", "CustomReturnWidget"],
  },
};
export default result;
