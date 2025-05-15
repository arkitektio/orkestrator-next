
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
    