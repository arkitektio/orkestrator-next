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
import { createLivekitClient } from "@/lib/livekit/client";
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
import { buildArkitekt, buildGuard } from "@/lib/arkitekt";
import { createDokumentsClient } from "@/lib//dokuments/client";
import { aliasToHttpPath, aliasToWsPath } from "@/lib/arkitekt/alias/helpers";
import { ServiceBuilderMap } from "@/lib/arkitekt/provider";
import { createGraphQLServiceBuilder } from "@/lib/arkitekt/builders/graphQlServiceBuidler";

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
    optional: true,
    builder: createGraphQLServiceBuilder(mikroResult.possibleTypes),
  },
  rekuest: {
    key: "rekuest",
    service: "live.arkitekt.rekuest",
    optional: true,
    builder: createGraphQLServiceBuilder(rekuestResult.possibleTypes),
  },
  lovekit: {
    key: "lovekit",
    service: "live.arkitekt.lovekit",
    optional: true,
    builder: createGraphQLServiceBuilder(lovekitResult.possibleTypes),
  },
  fluss: {
    key: "fluss",
    service: "live.arkitekt.fluss",
    optional: true,
    builder: createGraphQLServiceBuilder(flussResult.possibleTypes),
  },
  kabinet: {
    key: "kabinet",
    service: "live.arkitekt.kabinet",
    optional: true,
    builder: createGraphQLServiceBuilder(kabinetResult.possibleTypes),
  },
  omero_ark: {
    key: "omero_ark",
    service: "live.arkitekt.omero_ark",
    optional: true,
    builder: createGraphQLServiceBuilder(omeroArkResult.possibleTypes),
  },
  kraph: {
    key: "kraph",
    service: "live.arkitekt.kraph",
    optional: true,
    builder: createGraphQLServiceBuilder(kraphResult.possibleTypes),
  },
  alpaka: {
    key: "alpaka",
    service: "live.arkitekt.alpaka",
    optional: true,
    builder: createGraphQLServiceBuilder(alpakaResult.possibleTypes),
  },
  dokuments: {
    key: "dokuments",
    service: "live.arkitekt.dokuments",
    optional: true,
    builder: createGraphQLServiceBuilder(dokumentsResult.possibleTypes),
  },
  elektro: {
    key: "elektro",
    service: "live.arkitekt.elektro",
    optional: true,
    builder: createGraphQLServiceBuilder(elektroResult.possibleTypes),
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
    optional: true,
    builder: ({ alias }) => {
      return {
        client: { url: aliasToHttpPath(alias, "") },
        alias
      };
    },
  },
} as const satisfies ServiceBuilderMap;

// Check if running in tauri
export const Arkitekt = buildArkitekt({ manifest, serviceBuilderMap: serviceMap, selfServiceBuilder: createGraphQLServiceBuilder(lokResult.possibleTypes) });

export const Guard = {
  Lok: Arkitekt.Guard,
  Mikro: Arkitekt.buildServiceGuard("mikro"),
  Fluss: Arkitekt.buildServiceGuard("fluss"),
  Rekuest: Arkitekt.buildServiceGuard("rekuest"),
  Kabinet: Arkitekt.buildServiceGuard("kabinet"),
  OmeroArk: Arkitekt.buildServiceGuard("omero_ark"),
  Livekit: Arkitekt.buildServiceGuard("livekit"),
  Kraph: Arkitekt.buildServiceGuard("kraph"),
  Alpaka: Arkitekt.buildServiceGuard("alpaka"),
  Elektro: Arkitekt.buildServiceGuard("elektro"),
  Lovekit: Arkitekt.buildServiceGuard("lovekit"),
  Dokuments: Arkitekt.buildServiceGuard("dokuments"),
  Datalayer: Arkitekt.buildServiceGuard("datalayer"),
  Livekit: Arkitekt.buildServiceGuard("livekit"),
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
export const useDatalayerEndpoint = (): string | undefined => {
  const url = Arkitekt.usePotentialService("datalayer")?.client?.url;
  return url;
};
