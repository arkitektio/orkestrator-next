import { FaktsRequest, Manifest, useFakts, useLoadFakts } from "@/lib/fakts";
import { LoginRequest, useLogin } from "@/lib/herre";
import { open } from "@tauri-apps/plugin-shell";
import { useCallback } from "react";
import { useArkitekt } from "./provider";

import { invoke } from "@tauri-apps/api/core";

export const useService = (key: string) => {
  const { clients } = useArkitekt();

  return clients[key];
};

export type ArkitektLoginRequest = Partial<LoginRequest> & {
  faktsLokKey: string;
  redirectUri?: string;
};

export const useArkitektLogin = () => {
  const { fakts } = useFakts();
  const { login, ...rest } = useLogin();

  const adaptive_login = useCallback(
    async (
      request: ArkitektLoginRequest = {
        faktsLokKey: "lok",
        redirectUri: undefined,
      },
    ) => {
      if (!fakts) {
        throw new Error("Missing fakts");
      }

      let configGroup = fakts[request.faktsLokKey] as
        | { [key: string]: any }
        | undefined;

      if (!configGroup) {
        throw new Error(`Missing fakts.${request.faktsLokKey}`);
      }

      let configGroupKeys = [
        "client_id",
        "client_secret",
        "scopes",
        "base_url",
      ];

      for (let key of configGroupKeys) {
        if (!configGroup[key]) {
          throw new Error(`Missing key ${key} in fakts.${request.faktsLokKey}`);
        }
      }

      let redirectUri: string;
      if (window.__TAURI__) {
        let port = await invoke("oauth_start", {});
        redirectUri = "http://127.0.0.1:" + port + "/callback";
      } else {
        redirectUri = window.location.origin + "/callback";
      }

      return login({
        grant: {
          clientId: configGroup.client_id,
          clientSecret: configGroup.client_secret,
          scopes: configGroup.scopes,
          redirectUri: redirectUri,
        },
        endpoint: {
          base_url: configGroup.base_url,
          tokenUrl: configGroup.base_url + "/token/",
          userInfoEndpoint: configGroup.base_url + "/userinfo/",
          authUrl: configGroup.base_url + "/authorize/",
        },
        ...request,
      });
    },
    [fakts, login],
  );

  return {
    login: adaptive_login,
    ...rest,
  };
};

export const buildArkitektConnect = (manifest: Manifest) => () => {
  const { load, ...x } = useLoadFakts();

  const adaptive_load = useCallback(
    (request: Partial<FaktsRequest> = {}) => {
      if (!request.manifest) {
        request.manifest = manifest;
      }

      if (!request.manifest.scopes) {
        throw new Error("No scopes specified in manifest");
      }

      if (
        request.requestedClientType == "website" &&
        (!request.requestedRedirectURIs ||
          request.requestedRedirectURIs.length === 0)
      ) {
        request.requestedRedirectURIs = [window.location.origin + "/callback"];
      }

      if (window.__TAURI__) {
        console.log("Using desktop client");
        request.requestedClientType = "desktop";
        request.onOpenWindow = (request, code) => {
          let url = `${request.endpoint?.base_url}configure/?device_code=${code}&grant=device_code`;
          let win = open(url).then((x) => x);
          return {
            close: async () => {
              console.log("Closing window");
            },
          };
        };
      }
      return load(request as FaktsRequest);
    },
    [load],
  );

  return {
    ...x,
    load: adaptive_load,
  };
};
