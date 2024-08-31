import { manifest } from "@/constants";
import kabinetResult from "@/kabinet/api/fragments";
import { FaktsGuard, FaktsProps, Manifest, useFakts } from "@/lib/fakts";
import { createFlussClient } from "@/lib/fluss/client";
import { HerreGuard, HerreProps, useHerre } from "@/lib/herre";
import { createKabinetClient } from "@/lib/kabinet/client";
import { createMikroClient } from "@/lib/mikro/client";
import { createRekuestClient } from "@/lib/rekuest/client";
import lokResult from "@/lok-next/api/fragments";
import mikroResult from "@/mikro-next/api/fragments";
import omeroArkResult from "@/omero-ark/api/fragments";
import flussResult from "@/reaktion/api/fragments";
import rekuestResult from "@/rekuest/api/fragments";

import { createOmeroArkClient } from "@/lib/omero-ark/client";
import { createLokClient } from "@/lok-next/lib/LokClient";
import { buildArkitektConnect, useArkitektLogin } from "./hooks";
import {
  buildArkitektProvider,
  ServiceBuilderMap,
  useArkitekt,
} from "./provider";
import { App, ServiceMap } from "./types";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { createLivekitClient, LivekitClient } from "@/lib/livekit/client";
// When using the Tauri API npm package:

export function withKabinet<T extends (options: any) => any>(func: T): T {
  const Wrapped = (nana: any) => {
    const { clients } = useArkitekt();

    if (!clients.kabinet) {
      throw new Error("Kabinet client not available");
    }

    return func({ ...nana, client: clients.kabinet });
  };
  return Wrapped as T;
}

export const KabinetGuard = (props: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { clients } = useArkitekt();

  if (!clients.kabinet) {
    return <div>{props.fallback || "Loading"}</div>;
  }

  return props.children;
};

export const buildGuard =
  (key: string) =>
  (props: { children: React.ReactNode; fallback?: React.ReactNode }) => {
    const { clients } = useArkitekt();

    if (!clients[key]) {
      return <div>{props.fallback || "Loading"}</div>;
    }

    return props.children;
  };

export const buildWith =
  (key: string) =>
  <T extends (options: any) => any>(func: T): T => {
    const Wrapped = (nana: any) => {
      const { clients } = useArkitekt();

      if (!clients[key]) {
        throw new Error("Kabinet client not available");
      }

      return func({ ...nana, client: clients[key] });
    };
    return Wrapped as T;
  };

export type ArkitektGuardProps = {
  noAppFallback?: React.ReactNode;
  notConnectedFallback?: React.ReactNode;
  notLoggedInFallback?: React.ReactNode;
  children: React.ReactNode;
};

export const ArkitektGuard = ({
  notConnectedFallback = "Not Connected",
  notLoggedInFallback = "Not Logged In",
  children,
}: ArkitektGuardProps) => {
  return (
    <FaktsGuard fallback={notConnectedFallback}>
      <HerreGuard fallback={notLoggedInFallback}>{children}</HerreGuard>
    </FaktsGuard>
  );
};

export const useArkitektFakts = (key?: undefined | string) => {
  const { fakts } = useFakts();

  if (key) {
    if (key.includes(".")) {
      let keys = key.split(".");
      let result = fakts;
      for (let k of keys) {
        try {
          result = (result as any)[k];
        } catch (e) {
          throw new Error(`Missing fakts.${key}`);
        }
      }

      return result;
    }

    if ((fakts as any)[key]) {
      throw new Error(`Missing fakts.${key}`);
    }
    return (fakts as any)[key];
  }

  return fakts;
};

export const buildArkitekt = ({
  manifest,
  serviceBuilderMap,
  faktsProps,
  herreProps,
}: {
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
  faktsProps?: Partial<FaktsProps>;
  herreProps?: Partial<HerreProps>;
}) => {
  return {
    Provider: buildArkitektProvider({
      manifest,
      serviceBuilderMap,
      faktsProps,
      herreProps,
    }),
    Guard: ArkitektGuard,
    useLogin: useArkitektLogin,
    useFakts: useArkitektFakts,
    useToken: () => useHerre().token,
    useConnect: buildArkitektConnect(manifest, serviceBuilderMap),
  };
};

export const serviceMap: ServiceBuilderMap = {
  lok: {
    key: "lok",
    service: "live.arkitekt.lok",
    optional: false,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createLokClient({
          wsEndpointUrl: fakts.lok.ws_endpoint_url,
          endpointUrl: fakts.lok.endpoint_url,
          possibleTypes: lokResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  kabinet: {
    key: "kabinet",
    service: "live.arkitekt.kabinet",
    optional: false,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createKabinetClient({
          wsEndpointUrl: fakts.kabinet.ws_endpoint_url,
          endpointUrl: fakts.kabinet.endpoint_url,
          possibleTypes: kabinetResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  rekuest: {
    key: "rekuest",
    service: "live.arkitekt.rekuest",
    optional: false,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createRekuestClient({
          wsEndpointUrl: fakts.rekuest.ws_endpoint_url,
          endpointUrl: fakts.rekuest.endpoint_url,
          possibleTypes: rekuestResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  fluss: {
    key: "fluss",
    service: "live.arkitekt.fluss",
    optional: false,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createFlussClient({
          wsEndpointUrl: fakts.fluss.ws_endpoint_url,
          endpointUrl: fakts.fluss.endpoint_url,
          possibleTypes: flussResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  mikro: {
    key: "mikro",
    service: "live.arkitekt.mikro",
    optional: false,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createMikroClient({
          wsEndpointUrl: fakts.mikro.ws_endpoint_url,
          endpointUrl: fakts.mikro.endpoint_url,
          possibleTypes: mikroResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  omero_ark: {
    key: "omero_ark",
    service: "live.arkitekt.omero_ark",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createOmeroArkClient({
          wsEndpointUrl: fakts.omero_ark.ws_endpoint_url,
          endpointUrl: fakts.omero_ark.endpoint_url,
          possibleTypes: omeroArkResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  livekit: {
    key: "livekit",
    service: "io.livekit.livekit",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      console.log("Creating livekit client", fakts);
      return {
        client: createLivekitClient({
          url: fakts.livekit.https_endpoint,
        }),
      };
    },
  },
  datalayer: {
    key: "datalayer",
    service: "live.arkitekt.s3",
    optional: false,
    builder(manifest, fakts: any, token) {
      return {
        client: { url: fakts.datalayer.endpoint_url },
      };
    },
  },
};

export const electronRedirect = async (
  url: string,
  abortController: AbortController,
) => {
  console.log("Running redirect?", url);

  return await window.api.authenticate(url);
};
// Check if running in tauri

export const Arkitekt = window.electron
  ? buildArkitekt({
      manifest,
      serviceBuilderMap: serviceMap,
      herreProps: { doRedirect: electronRedirect },
    })
  : buildArkitekt({ manifest, serviceBuilderMap: serviceMap });

export const Guard = {
  Lok: buildGuard("lok"),
  Mikro: buildGuard("mikro"),
  Fluss: buildGuard("fluss"),
  Rekuest: buildGuard("rekuest"),
  Kabinet: buildGuard("kabinet"),
  OmeroArk: buildGuard("omero_ark"),
  Livekit: buildGuard("livekit"),
};

export const useMikro = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.mikro.client) {
    throw new Error("Mikro client not available");
  }

  return clients.mikro.client;
};

export const useKabinet = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.kabinet?.client) {
    throw new Error("Kabinet client not available");
  }

  return clients.kabinet.client;
};

export const useRekuest = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.rekuest?.client) {
    throw new Error("Rekuest client not available");
  }

  return clients.rekuest?.client;
};

export const useLok = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.lok?.client) {
    throw new Error("Lok client not available");
  }

  return clients.lok?.client;
};

export const useFluss = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.fluss.client) {
    throw new Error("Fluss client not available");
  }

  return clients.fluss.client;
};

export const useOmeroArk = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.omero_ark?.client) {
    throw new Error("OmeroArk client not available");
  }

  return clients.omero_ark?.client;
};

export const useLivekit = (): LivekitClient => {
  const { clients } = useArkitekt();

  if (!clients.livekit?.client) {
    throw new Error("Livekit client not available");
  }

  return clients.livekit.client;
};
