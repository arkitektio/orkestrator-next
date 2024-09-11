import {
  FaktsEndpoint,
  Manifest,
  Demander,
  FaktsRequest,
  Closable,
} from "../../FaktsContext";
import { fetchWithTimeout } from "../../helpers";

const challenge = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  controller: AbortController,
  code: string,
  retry: number = 0,
): Promise<string> => {
  if (retry > (request.maxRetrievalAttempts || 5)) {
    throw new Error("Too many retries");
  }

  try {
    console.log("Trying to challenge code");
    let response = await fetchWithTimeout(`${endpoint.base_url}challenge/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
      timeout: request.challengeTimeout || 5000,
      controller: controller,
    });

    console.log("Reponse is", response);
    if (response.ok) {
      let json = await response.json();
      console.log("JSON is", json);
      if (json.status == "pending") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return challenge(request, endpoint, controller, code, retry + 1);
      }

      if (json.status == "granted") {
        return json.token;
      }

      if (json.status == "waiting") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return challenge(request, endpoint, controller, code, retry + 1);
      }

      if (json.status == "error") {
        throw new Error(json.message);
      }
      if (json.challenge) {
        return json.challenge;
      }
      throw new Error("Malformed response");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return challenge(request, endpoint, controller, code, retry + 1);
    }
  } catch (e) {
    if ((e as Error).message == "User Cancelled") {
      console.log("Grant was aborted by users");
      throw new Error("User Cancelled");
    } else {
      console.log("Error", e);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return challenge(request, endpoint, controller, code, retry + 1);
    }
  }
};

export const getDeviceCode: Demander = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  controller: AbortController,
) => {
  let response = await fetch(`${endpoint.base_url}start/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      manifest: request.manifest,
      requested_client_kind: request.requestedClientType || "website",
      requested_public: request.requestPublic || false,
      expiration_time_seconds: request.deviceCodeExpirationTime,
      redirect_uris: request.requestedRedirectURIs,
    }),
    signal: controller.signal,
  });
  if (response.ok) {
    let json = await response.json();
    if (json.status == "error") {
      throw new Error(json.message);
    }
    if (json.code) {
      return json.code;
    }
    console.error("Malformed response", json);
    throw new Error("Malformed Device Code response");
  }
};

export const popOutWindowOpen = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  code: string,
): Promise<Closable> => {
  let url = `${endpoint.base_url}configure/?device_code=${code}&grant=device_code`;
  let win;
  if (window.api) {
    // Running in electron
    win = window.api.startFakts(url);
  } else {
    win = window.open(url, "Fakts Grant", "width=600,height=600");
  }
  if (!win) {
    throw new Error("Could not open window");
  }
  return {
    close: async () => {
      try {
        if (win.close) {
          win.close();
        }
      } catch (e) {
        console.error("Could not close window", e);
      }
    },
  };
};
export const demandDeviceToken = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  controller: AbortController,
) => {
  let code = await getDeviceCode(request, endpoint, controller);

  let handle: Closable;
  if (request.onOpenWindow) {
    handle = await request.onOpenWindow(request, code);
  } else {
    handle = await popOutWindowOpen(request, endpoint, code);
  }

  let token = await challenge(request, endpoint, controller, code);
  if (handle) {
    await handle.close();
  }
  return token;
};

export const demandRetrieve = async (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  controller: AbortController,
) => {
  let response = await fetchWithTimeout(`${endpoint.base_url}retrieve/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      manifest: request.manifest,
    }),
    timeout: request.retrieveTimeout || 5000,
    controller: controller,
  });

  if (response.ok) {
    let json = await response.json();
    if (json.status == "error") {
      throw new Error(json.message);
    }
    if (json.token) {
      return json.token;
    }
    throw new Error("Malformed response");
  }
};

export const buildFailsafeDemander = (...args: Demander[]): Demander => {
  return async (
    request: FaktsRequest,
    endpoint: FaktsEndpoint,
    abortController,
  ) => {
    let errors = [];
    for (let demander of args) {
      try {
        return await demander(request, endpoint, abortController);
      } catch (e) {
        console.log("Demander failed", e);
        errors.push(e);
        // Check if is abort Error
        if ((e as Error).message == "User Cancelled") {
          console.log("Grant was aborted by users");
          throw new Error("User Cancelled");
        }
      }
    }
    if (request.showAllErrors) {
      throw new Error(
        "No grant worked" + errors.map((e) => (e as Error).message).join(", "),
      );
    } else {
      throw new Error("No grant worked" + (errors.at(-1) as Error).message);
    }
  };
};
