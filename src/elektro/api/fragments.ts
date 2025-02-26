
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Descendant": [
      "LeafDescendant",
      "MentionDescendant",
      "ParagraphDescendant"
    ],
    "SocialAccount": [
      "GenericAccount",
      "OrcidAccount"
    ]
  }
};
      export default result;
    