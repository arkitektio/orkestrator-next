
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ActionActionInvalidActionImplementationAction": [
      "ActionAction",
      "ImplementationAction",
      "InvalidAction"
    ],
    "AssignWidget": [
      "ChoiceAssignWidget",
      "CustomAssignWidget",
      "SearchAssignWidget",
      "SliderAssignWidget",
      "StateChoiceAssignWidget",
      "StringAssignWidget"
    ],
    "DependencyEdgeImplementationEdge": [
      "DependencyEdge",
      "ImplementationEdge"
    ],
    "Effect": [
      "CustomEffect",
      "MessageEffect"
    ],
    "ReturnWidget": [
      "ChoiceReturnWidget",
      "CustomReturnWidget"
    ],
    "UIChild": [
      "UIGrid",
      "UISplit",
      "UIState"
    ]
  }
};
      export default result;
    