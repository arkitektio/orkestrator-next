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


export const serviceMap = {
  mikro: {
    key: "mikro",
    service: "live.arkitekt.mikro",
    optional: false,
    builder: ({ alias, token }) => {
      return {
        client: createMikroClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: mikroResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  rekuest: {
    key: "rekuest",
    service: "live.arkitekt.rekuest",
    optional: false,
    builder: ({ alias, token }) => {
      return {
        client: createRekuestClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: rekuestResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  lovekit: {
    key: "lovekit",
    service: "live.arkitekt.lovekit",
    optional: true,
    builder: ({ alias, token }) => {
      return {
        client: createLovekitClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: lovekitResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  fluss: {
    key: "fluss",
    service: "live.arkitekt.fluss",
    optional: false,
    builder: ({ alias, token }) => {
      return {
        client: createFlussClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: flussResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  lok: {
    key: "lok",
    service: "live.arkitekt.lok",
    optional: false,
    builder: ({ alias, token }) => {
      return {
        client: createLokClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: lokResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  kabinet: {
    key: "kabinet",
    service: "live.arkitekt.kabinet",
    optional: false,
    builder: ({ alias, token }) => {
      return {
        client: createKabinetClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: kabinetResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  omero_ark: {
    key: "omero_ark",
    service: "live.arkitekt.omero_ark",
    optional: true,
    builder: ({ alias, token }) => {
      return {
        client: createOmeroArkClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: omeroArkResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  kraph: {
    key: "kraph",
    service: "live.arkitekt.kraph",
    optional: true,
    builder: ({ alias, token }) => {
      return {
        client: createKraphClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: kraphResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  alpaka: {
    key: "alpaka",
    service: "live.arkitekt.alpaka",
    optional: true,
    builder: ({ alias, token }) => {
      return {
        client: createAlpakaClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: alpakaResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  dokuments: {
    key: "dokuments",
    service: "live.arkitekt.dokuments",
    optional: true,
    builder:  ({ alias, token }) => {
      return {
        client: createDokumentsClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: dokumentsResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias,
      };
    },
  },
  elektro: {
    key: "elektro",
    service: "live.arkitekt.elektro",
    optional: true,
    builder: ({ alias, token }) => {
      return {
        client: createElektroClient({
          wsEndpointUrl: aliasToWsPath(alias, "graphql"),
          endpointUrl: aliasToHttpPath(alias, "graphql"),
          possibleTypes: elektroResult.possibleTypes,
          retrieveToken: () => token,
        }),
        alias
      };
    },
  },
  livekit: {
    key: "livekit",
    service: "io.livekit.livekit",
    optional: true,
    omitchallenge: true,
    forceinsecure: true,
    builder:  ({ alias }) => {
      return {
        client: createLivekitClient({
          url: aliasToHttpPath(alias, ""),
        }),
        alias
      };
    },
  },
  datalayer: {
    key: "datalayer",
    service: "live.arkitekt.s3",
    optional: false,
    builder: ({ alias }) => {
      return {
        client: { url: aliasToHttpPath(alias, "") },
        alias
      };

    },
  },
} as const satisfies ServiceBuilderMap;

// Check if running in tauri
export const Arkitekt = buildArkitekt({ manifest, serviceBuilderMap: serviceMap });

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

export const useMikro = () => {
  return Arkitekt.useService("mikro").client;
};

export const useKabinet = () => {
  return Arkitekt.useService("kabinet").client
};

export const useRekuest = () => {
  return Arkitekt.useService("rekuest").client;
};

export const useLok = () => {
  return Arkitekt.useService("lok").client;
};

export const useFluss = () => {
  return Arkitekt.useService("fluss").client
};

export const useOmeroArk = () => {
  return Arkitekt.useService("omero_ark").client
};

export const useKraph = () => {
  return Arkitekt.useService("kraph").client;
}

export const useAlpaka = ()=> {
  return Arkitekt.useService("alpaka").client;
};

export const useLovekit = () => {
  return Arkitekt.useService("lovekit").client;
};

export const useElektro = () => {
  return Arkitekt.useService("elektro").client;
};

export const useLivekit = () => {
  return Arkitekt.useService("livekit").client;
};

export const useFake = () => {
  return Arkitekt.useService("fake").client;
}

export const useDokuments = () => {
  return Arkitekt.useService("dokuments").client;
};
export const useDatalayerEndpoint = (): string => {
  const url = Arkitekt.useService("datalayer").client.url;
  if (!url) {
    throw Error("No Datalayer configured ");
  }
  return url;
};
