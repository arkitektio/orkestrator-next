import {
  Claimer,
  Demander,
  Discovery,
  FaktsRequest,
  Grant,
  UnvalidatedFakts,
} from "../FaktsContext";
import { claimClaimer } from "./remote/claimers";
import { demandRetrieve } from "./remote/demanders";
import { discovery } from "./remote/discovery";

export type RemoteGrantParams = {
  discover?: Discovery;
  demand?: Demander;
  claim?: Claimer;
};

export const buildRemoteGrant = (
  {
    demand = demandRetrieve,
    claim = claimClaimer,
    discover = discovery,
  }: RemoteGrantParams = {
    demand: demandRetrieve,
    claim: claimClaimer,
    discover: discovery,
  },
): Grant => {
  return async (
    request: FaktsRequest,
    controller: AbortController,
  ): Promise<UnvalidatedFakts> => {
    request.onProgress && request.onProgress("Discovering Endpoints");
    let discovered = await discover(request, controller);
    request.onProgress &&
      request.onProgress(`Demanding Token on ${discovered.name}`);
    let token = await demand(request, discovered, controller);
    request.onProgress && request.onProgress("Claiming Fakts");
    let fakts = await claim(request, discovered, token, controller);
    return fakts;
  };
};
