
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "NetConnection": [
      "SynapticConnection"
    ],
    "NetSynapse": [
      "Exp2Synapse"
    ],
    "Signal": [
      "AnalogSignal",
      "IrregularlySampledSignal",
      "SpikeTrain"
    ],
    "View": [
      "FileView",
      "TimelineView"
    ],
    "_Entity": [
      "App",
      "BigFileStore",
      "Client",
      "MediaStore",
      "ModEnvironment",
      "Organization",
      "ParquetStore",
      "Release",
      "User",
      "ZarrStore"
    ]
  }
};
      export default result;
    