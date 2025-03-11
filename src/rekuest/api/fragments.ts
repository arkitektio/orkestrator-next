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
    DependencyEdgeImplementationEdge: ["DependencyEdge", "ImplementationEdge"],
    Effect: ["CustomEffect", "MessageEffect"],
    NodeNodeInvalidNodeTemplateNode: [
      "InvalidNode",
      "NodeNode",
      "TemplateNode",
    ],
    ReturnWidget: ["ChoiceReturnWidget", "CustomReturnWidget"],
    UIChild: ["UIGrid", "UISplit", "UIState"],
  },
};
export default result;
