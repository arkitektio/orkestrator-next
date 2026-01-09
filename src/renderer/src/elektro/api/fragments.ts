
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
    ]
  }
};
      export default result;
    