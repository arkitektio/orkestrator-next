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
import { Ward } from "@/rekuest/widgets/WidgetsContext";
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
  clients: ServiceMap;
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
      let clients: { [key: string]: Service<any> } = {};

      console.log("Building clients for", fakts);

      for (let key in serviceBuilderMap) {
        let definition = serviceBuilderMap[key];
        try {
          clients[key] = definition.builder(manifest, fakts, token);
        } catch (e) {
          console.error(`Failed to build client for ${key}`, e);
          if (!definition.optional) {
            throw e;
          }
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

export type Service<T extends any = any> = {
  ward?: Ward;
  client: T;
};

export type ServiceBuilder<T> = (
  manifest: Manifest,
  fakts: Fakts,
  token: Token,
) => Service<T>;

export type ServiceDefinition<T extends any = any> = {
  builder: ServiceBuilder<T>;
  key: string;
  service: string;
  optional: boolean;
};

export type ServiceBuilderMap = {
  [key: string]: ServiceDefinition<any>;
};

export type ServiceMap = {
  [key: string]: Service<any>;
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
