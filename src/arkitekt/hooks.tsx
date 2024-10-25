import { FaktsRequest, Manifest, useFakts, useLoadFakts } from "@/lib/fakts";
import { LoginRequest, useLogin } from "@/lib/herre";

import { useCallback } from "react";
import { useArkitekt } from "./provider";

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
      if (window.electron) {
        redirectUri = "http://127.0.0.1:9999/callback";
      } else {
        redirectUri = window.location.origin + "/callback";
        alert(redirectUri);
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

export const buildArkitektConnect =
  (manifest: Manifest, serviceBuilderMap) => () => {
    const { load, ...x } = useLoadFakts();

    const adaptive_load = useCallback(
      (request: Partial<FaktsRequest> = {}) => {
        if (!request.manifest) {
          request.manifest = manifest;
        }

        if (!request.manifest.scopes) {
          throw new Error("No scopes specified in manifest");
        }

        let requirements = Object.keys(serviceBuilderMap).map((key) => {
          let service = serviceBuilderMap[key];
          return {
            key: service.key,
            optional: service.optional,
            service: service.service,
          };
        });

        request.manifest.requirements = requirements;

        if (window.electron) {
          request.requestedClientType = "desktop";
        } else {
          request.requestedClientType = "website";
        }

        if (
          request.requestedClientType == "website" &&
          (!request.requestedRedirectURIs ||
            request.requestedRedirectURIs.length === 0)
        ) {
          request.requestedRedirectURIs = [
            window.location.origin + "/callback",
          ];
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
