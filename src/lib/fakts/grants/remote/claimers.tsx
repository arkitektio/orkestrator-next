import {
  Claimer,
  Fakts,
  FaktsEndpoint,
  FaktsRequest,
} from "../../FaktsContext";

export const claimClaimer: Claimer = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  token: string,
  controller: AbortController,
): Promise<Fakts> => {
  console.log("Claiming Fakts", request, endpoint, token);
  let response = await fetch(`${endpoint.base_url}claim/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      secure: true,
    }),
    signal: controller.signal,
  });
  if (response.ok) {
    let json = await response.json();
    if (json.config) {
      return json.config as Fakts;
    } else {
      console.error("Malformed Claim Answer", response);
      throw Error("Malformed answered when claiming Fakts");
    }
  }

  throw Error("Received non 200 when claiming Fakts from token");
};
