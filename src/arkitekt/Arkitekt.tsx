import alpakaResult from "@/alpaka/api/fragments";
import { manifest } from "@/constants";
import elektroResult from "@/elektro/api/fragments";
import kabinetResult from "@/kabinet/api/fragments";
import kraphResult from "@/kraph/api/fragments";
import { createAlpakaClient } from "@/lib/alpaka/client";
import { createElektroClient } from "@/lib/elektro/client";
import { createFlussClient } from "@/lib/fluss/client";
import { createKabinetClient } from "@/lib/kabinet/client";
import { createKraphClient } from "@/lib/kraph/client";
import { createLivekitClient, LivekitClient } from "@/lib/livekit/client";
import { createMikroClient } from "@/lib/mikro/client";
import { createOmeroArkClient } from "@/lib/omero-ark/client";
import { createRekuestClient } from "@/lib/rekuest/client";
import lokResult from "@/lok-next/api/fragments";
import { createLokClient } from "@/lok-next/lib/LokClient";
import mikroResult from "@/mikro-next/api/fragments";
import omeroArkResult from "@/omero-ark/api/fragments";
import flussResult from "@/reaktion/api/fragments";
import rekuestResult from "@/rekuest/api/fragments";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { buildArkitekt, buildGuard } from ".";
import { ServiceBuilderMap, useArkitekt } from "./provider";
import { createLovekitClient } from "@/lib/lovekit/client";

export const electronRedirect = async (
  url: string,
  abortController: AbortController,
) => {
  return await window.api.authenticate(url);
};

export const serviceMap: ServiceBuilderMap = {
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
  lovekit: {
    key: "lovekit",
    service: "live.arkitekt.lovekit",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createLovekitClient({
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
  kraph: {
    key: "kraph",
    service: "live.arkitekt.kraph",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createKraphClient({
          wsEndpointUrl: fakts.kraph.ws_endpoint_url,
          endpointUrl: fakts.kraph.endpoint_url,
          possibleTypes: kraphResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  alpaka: {
    key: "alpaka",
    service: "live.arkitekt.alpaka",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createAlpakaClient({
          wsEndpointUrl: fakts.alpaka.ws_endpoint_url,
          endpointUrl: fakts.alpaka.endpoint_url,
          possibleTypes: alpakaResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  elektro: {
    key: "elektro",
    service: "live.arkitekt.elektro",
    optional: true,
    builder: (manifest, fakts: any, token) => {
      return {
        client: createElektroClient({
          wsEndpointUrl: fakts.elektro.ws_endpoint_url,
          endpointUrl: fakts.elektro.endpoint_url,
          possibleTypes: elektroResult.possibleTypes,
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
  Kraph: buildGuard("kraph"),
  Alpaka: buildGuard("alpaka"),
  Elektro: buildGuard("elektro"),
  Lovekit: buildGuard("lovekit"),
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

export const useKraph = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.kraph?.client) {
    throw new Error("Kraph client not available");
  }

  return clients.kraph?.client;
};

export const useAlpaka = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.alpaka?.client) {
    throw new Error("Alpaka client not available");
  }

  return clients.alpaka?.client;
};

export const useLovekit = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.lovekit?.client) {
    throw new Error("Lovekit client not available");
  }

  return clients.lovekit?.client;
};

export const useElektro = (): ApolloClient<NormalizedCache> => {
  const { clients } = useArkitekt();

  if (!clients.elektro?.client) {
    throw new Error("Elektro client not available");
  }

  return clients.elektro?.client;
};

export const useLivekit = (): LivekitClient => {
  const { clients } = useArkitekt();

  if (!clients.livekit?.client) {
    throw new Error("Livekit client not available");
  }

  return clients.livekit.client;
};
