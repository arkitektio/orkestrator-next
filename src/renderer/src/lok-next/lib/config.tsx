import { PossibleTypesMap } from "@apollo/client";

export type LokConfig = {
  endpointUrl: string;
  wsEndpointUrl: string;
  retrieveToken: () => string | null;
  possibleTypes: PossibleTypesMap;
};
