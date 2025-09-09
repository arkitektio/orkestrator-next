import alpakaResult from "@/alpaka/api/fragments";
import { manifest } from "@/constants";
import dokumentsResult from "@/dokuments/api/fragments";
import elektroResult from "@/elektro/api/fragments";
import kabinetResult from "@/kabinet/api/fragments";
import { createKabinetClient } from "@/kabinet/lib/KabinetClient";
import kraphResult from "@/kraph/api/fragments";
import { createAlpakaClient } from "@/lib/alpaka/client";
import { createElektroClient } from "@/lib/elektro/client";
import { createFlussClient } from "@/lib/fluss/client";
import { createKraphClient } from "@/lib/kraph/client";
import { createLivekitClient, LivekitClient } from "@/lib/livekit/client";
import { createLovekitClient } from "@/lib/lovekit/client";
import { createMikroClient } from "@/lib/mikro/client";
import { createOmeroArkClient } from "@/lib/omero-ark/client";
import { createRekuestClient } from "@/lib/rekuest/client";
import lokResult from "@/lok-next/api/fragments";
import { createLokClient } from "@/lok-next/lib/LokClient";
import lovekitResult from "@/lovekit/api/fragments";
import mikroResult from "@/mikro-next/api/fragments";
import omeroArkResult from "@/omero-ark/api/fragments";
import flussResult from "@/reaktion/api/fragments";
import rekuestResult from "@/rekuest/api/fragments";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { buildArkitekt, buildGuard } from ".";
import { createDokumentsClient } from "../dokuments/client";
import { aliasToHttpPath, aliasToWsPath } from "./alias/helpers";
import { ServiceBuilderMap, useService } from "./provider";

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
    builder: async ({ alias, token }) => {
      return {
        client: createMikroClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createRekuestClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createLovekitClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: lovekitResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  fluss: {
    key: "fluss",
    service: "live.arkitekt.fluss",
    optional: false,
    builder: async ({ alias, token }) => {
      return {
        client: createFlussClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createLokClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createKabinetClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createOmeroArkClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createKraphClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createAlpakaClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: alpakaResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  dokuments: {
    key: "dokuments",
    service: "live.arkitekt.dokuments",
    optional: true,
    builder: async ({ alias, token }) => {
      return {
        client: createDokumentsClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: dokumentsResult.possibleTypes,
          retrieveToken: () => token,
        }),
      };
    },
  },
  elektro: {
    key: "elektro",
    service: "live.arkitekt.elektro",
    optional: true,
    builder: async ({ alias, token }) => {
      return {
        client: createElektroClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
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
    builder: async ({ alias, token }) => {
      return {
        client: createLivekitClient({
          url: aliasToHttpPath(alias, ""),
        }),
      };
    },
  },
  datalayer: {
    key: "datalayer",
    service: "live.arkitekt.s3",
    optional: false,
    builder: async ({ alias, token }) => {
      return {
        client: { url: aliasToHttpPath(alias, "") },
      };
    },
  },
};

// Check if running in tauri
export const Arkitekt = window.electron
  ? buildArkitekt({
      manifest,
      serviceBuilderMap: serviceMap,
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
  Dokuments: buildGuard("dokuments"),
};

export const useMikro = (): ApolloClient<NormalizedCache> => {
  return useService("mikro").client as ApolloClient<NormalizedCache>;
};

export const useKabinet = (): ApolloClient<NormalizedCache> => {
  return useService("kabinet").client as ApolloClient<NormalizedCache>;
};

export const useRekuest = (): ApolloClient<NormalizedCache> => {
  return useService("rekuest").client as ApolloClient<NormalizedCache>;
};

export const useLok = (): ApolloClient<NormalizedCache> => {
  return useService("lok").client as ApolloClient<NormalizedCache>;
};

export const useFluss = (): ApolloClient<NormalizedCache> => {
  return useService("fluss").client as ApolloClient<NormalizedCache>;
};

export const useOmeroArk = (): ApolloClient<NormalizedCache> => {
  return useService("omero_ark").client as ApolloClient<NormalizedCache>;
};

export const useKraph = (): ApolloClient<NormalizedCache> => {
  return useService("kraph").client as ApolloClient<NormalizedCache>;
};

export const useAlpaka = (): ApolloClient<NormalizedCache> => {
  return useService("alpaka").client as ApolloClient<NormalizedCache>;
};

export const useLovekit = (): ApolloClient<NormalizedCache> => {
  return useService("lovekit").client as ApolloClient<NormalizedCache>;
};

export const useElektro = (): ApolloClient<NormalizedCache> => {
  return useService("elektro").client as ApolloClient<NormalizedCache>;
};

export const useLivekit = (): LivekitClient => {
  return useService("livekit").client as LivekitClient;
};

export const useDokuments = (): ApolloClient<NormalizedCache> => {
  return useService("dokuments").client as ApolloClient<NormalizedCache>;
};
export const useDatalayerEndpoint = (): string => {
  const url = useService("datalayer").client.url;
  if (!url) {
    throw Error("No Datalayer configured ");
  }
  return url;
};
