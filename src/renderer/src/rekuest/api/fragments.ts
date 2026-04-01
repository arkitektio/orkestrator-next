
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
      "HideEffect",
      "MessageEffect"
    ],
    "ReturnWidget": [
      "ChoiceReturnWidget",
      "CustomReturnWidget"
    ],
    "StateSnapshotEventStatePatchEvent": [
      "StatePatchEvent",
      "StateSnapshotEvent"
    ],
    "UIChild": [
      "UIGrid",
      "UISplit",
      "UIState"
    ],
    "_Entity": [
      "MediaStore",
      "User"
    ]
  }
};
      export default result;
    