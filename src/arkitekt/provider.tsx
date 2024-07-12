import {
  buildFailsafeDemander,
  buildRemoteGrant,
  demandDeviceToken,
  demandRetrieve,
  Fakts,
  FaktsProps,
  FaktsProvider,
  Manifest,
  useFakts,
} from "@/lib/fakts";
import { HerreProps, HerreProvider, Token, useHerre } from "@/lib/herre";
import { ApolloClient } from "@apollo/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type AppContext = {
  manifest: Manifest;
  clients: { [key: string]: ApolloClient<any> };
};

export const ArkitektContext = createContext<AppContext>({
  manifest: undefined as unknown as Manifest,
  clients: {},
});
export const useArkitekt = () => useContext(ArkitektContext);

export const ServiceProvier = ({
  children,
  manifest,
  serviceBuilderMap,
}: {
  children: ReactNode;
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
}) => {
  const { fakts } = useFakts();

  const { token } = useHerre();

  const [context, setContext] = useState<AppContext>({
    manifest: manifest,
    clients: {},
  });

  useEffect(() => {
    if (fakts && token) {
      let clients: { [key: string]: ApolloClient<any> } = {};

      for (let key in serviceBuilderMap) {
        let builder = serviceBuilderMap[key];
        try {
          clients[key] = builder(manifest, fakts, token);
        } catch (e) {
          console.error(`Failed to build client for ${key}`, e);
        }
      }

      setContext({ manifest: manifest, clients });
    }
  }, [fakts, token, serviceBuilderMap]);

  return (
    <ArkitektContext.Provider value={context}>
      {children}
    </ArkitektContext.Provider>
  );
};

const defaultFaktsProps: Partial<FaktsProps> = {
  grant: buildRemoteGrant({
    demand: buildFailsafeDemander(demandRetrieve, demandDeviceToken),
  }),
};

export type ServiceBuilder = (
  manifest: Manifest,
  fakts: Fakts,
  token: Token,
) => ApolloClient<any>;

export type ServiceBuilderMap = {
  [key: string]: ServiceBuilder;
};

export type ArkitektBuilderOptions = {
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
  faktsProps?: Partial<FaktsProps>;
  herreProps?: Partial<HerreProps>;
};

export const buildArkitektProvider =
  (options: ArkitektBuilderOptions) =>
  ({ children }: { children: ReactNode }) => {
    return (
      <FaktsProvider {...options.faktsProps}>
        <HerreProvider {...options.herreProps}>
          <ServiceProvier
            manifest={options.manifest}
            serviceBuilderMap={options.serviceBuilderMap}
          >
            {children}
          </ServiceProvier>
        </HerreProvider>
      </FaktsProvider>
    );
  };
