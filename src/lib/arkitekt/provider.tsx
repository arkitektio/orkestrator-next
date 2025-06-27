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
import {
  ActiveFakts,
  ActiveFaktsSchema,
  Alias,
  AuthFakt,
  Instance,
} from "./fakts/faktsSchema";
import { start } from "./fakts/start";
import { resolve } from "path";
import { resolveWorkingAlias } from "./alias/resolve";
import { flow } from "./fakts/flow";
import { Manifest } from "./fakts/manifestSchema";
import { FaktsEndpoint } from "./fakts/endpointSchema";
import { login } from "./oauth/login";
import { manifest } from "@/constants";
import { TokenResponse, TokenResponseSchema } from "./fakts/tokenSchema";

export type AvailableService = {
  key: string;
  service: string;
  resolved: Alias;
};

export type UnresolvedService = {
  key: string;
  service: string;
  aliases: Alias[] | undefined;
};

export type Service<T extends any = any> = {
  ward?: Ward;
  client: ApolloClient<T>;
};

export type ServiceBuilder<T> = (options: {
  manifest: Manifest;
  instance: Instance;
  alias: Alias;
  fakts: ActiveFakts;
  token: Token;
}) => Promise<Service<T>>;

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

export type AppContext = {
  manifest: Manifest;
  connection?: ConnectedContext;
};

export type AppFunctions = {
  connect: ConnectFunction;
  disconnect: DisconnectFunction;
};

export type ConnectedContext = {
  fakts: ActiveFakts;
  clients: ServiceMap;
  token: Token;
  availableServices: AvailableService[];
  unresolvedServices?: UnresolvedService[];
};

export type ConnectFunction = (options: {
  endpoint: FaktsEndpoint;
  controller: AbortController;
}) => Promise<AppContext>;

export type DisconnectFunction = () => Promise<void>;

export const ArkitektContext = createContext<AppContext & AppFunctions>({
  manifest: undefined as unknown as Manifest,
  connect: async () => {
    throw new Error("No provider");
  },
  disconnect: async () => {
    throw new Error("No provider");
  },
  connection: undefined,
});
export const useArkitekt = () => useContext(ArkitektContext);

export const useService = (key: string) => {
  const { connection } = useArkitekt();

  if (!connection) {
    throw new Error("Arkitekt not connected");
  }

  if (!connection.clients[key]) {
    throw new Error(`Service ${key} not available`);
  }

  return connection?.clients[key];
};

export const usePotentialService = (key: string) => {
  const { connection } = useArkitekt();

  return connection?.clients[key];
};

export const useToken = () => {
  return useArkitekt().connection?.token || null;
};

export const buildContext = async ({
  fakts,
  manifest,
  serviceBuilderMap,
  token,
  controller,
}: {
  fakts: ActiveFakts;
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
  token: Token;
  controller: AbortController;
}): Promise<ConnectedContext> => {
  let clients: { [key: string]: Service<any> } = {};

  console.log("Building clients for", fakts);

  let availableServices = [] as AvailableService[];
  let unresolvedServices = [] as UnresolvedService[];

  for (let key in serviceBuilderMap) {
    let definition = serviceBuilderMap[key];
    try {
      if (!definition.builder) {
        throw new Error(`No builder defined for service ${key}`);
      }

      if (!definition.service) {
        throw new Error(`No service defined for service ${key}`);
      }

      let serviceInstance = fakts.instances[key];
      if (!serviceInstance) {
        throw new Error(`No instance found for service ${key}`);
      }

      let alias = await resolveWorkingAlias({
        instance: serviceInstance,
        timeout: 1000,
        controller,
      });

      clients[key] = await definition.builder({
        manifest,
        alias,
        token,
        fakts,
        instance: serviceInstance,
      });

      availableServices.push({
        key,
        service: definition.service,
        resolved: alias,
      });
    } catch (e) {
      console.error(`Failed to build client for ${key}`, e);
      if (!definition.optional) {
        throw e;
      } else {
        console.warn(`Service ${key} is optional, skipping...`);
        unresolvedServices.push({
          key,
          service: definition.service,
          aliases: fakts.instances[key]?.aliases,
        });
      }
    }
  }

  return {
    clients,
    fakts: fakts,
    availableServices: availableServices,
    unresolvedServices:
      unresolvedServices.length > 0 ? unresolvedServices : undefined,
    token: token,
  };
};

export const ArkitektProvider = ({
  children,
  manifest,
  serviceBuilderMap,
}: {
  children: ReactNode;
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
}) => {
  const [context, setContext] = useState<AppContext>({
    manifest: manifest,
    connection: undefined,
  });

  const connect = async (options: {
    endpoint: FaktsEndpoint;
    controller: AbortController;
  }): Promise<Omit<AppContext, "connect">> => {
    // Build Manifest

    const fakts = await flow({
      endpoint: options.endpoint,
      controller: options.controller,
      manifest: manifest,
    });

    // Save fakts to local storage
    localStorage.setItem("fakts", JSON.stringify(fakts));

    const token = await login(fakts.auth);

    localStorage.setItem("token", JSON.stringify(token));

    const connectedContext = await buildContext({
      fakts,
      manifest,
      serviceBuilderMap,
      token: token.access_token,
      controller: options.controller,
    });

    setContext((context) => ({
      ...context,
      manifest: manifest,
      connection: connectedContext,
    }));

    return {
      ...context,
      manifest: manifest,
      connection: connectedContext,
    };
  };

  const disconnect = async () => {
    setContext((context) => ({
      ...context,
      connection: undefined,
    }));
    localStorage.removeItem("fakts");
    localStorage.removeItem("token");
  };

  // 🔁 Auto-login effect on mount
  useEffect(() => {
    const tryReconnect = async () => {
      const faktsRaw = localStorage.getItem("fakts");
      const tokenRaw = localStorage.getItem("token");

      if (!faktsRaw || !tokenRaw) return;

      try {
        const fakts: ActiveFakts = ActiveFaktsSchema.parse(
          JSON.parse(faktsRaw),
        );
        const token: TokenResponse = TokenResponseSchema.parse(
          JSON.parse(tokenRaw),
        );

        const controller = new AbortController();

        const connectedContext = await buildContext({
          fakts,
          manifest,
          serviceBuilderMap,
          token: token.access_token,
          controller,
        });

        setContext({
          manifest,
          connection: connectedContext,
        });
      } catch (e) {
        console.warn("Auto-login failed:", e);
        localStorage.removeItem("fakts");
        localStorage.removeItem("token");
      }
    };

    tryReconnect();
  }, [manifest, serviceBuilderMap]);

  return (
    <ArkitektContext.Provider value={{ ...context, connect, disconnect }}>
      {children}
    </ArkitektContext.Provider>
  );
};

export type ConnectedGuardProps = {
  notConnectedFallback?: React.ReactNode;
};

export const ConnectedGuard = ({
  notConnectedFallback = "Not Connected",
  children,
}: ConnectedGuardProps & { children: ReactNode }) => {
  const { connection } = useArkitekt();

  if (!connection) {
    return <>{notConnectedFallback}</>;
  }

  return <>{children}</>;
};

export type ArkitektBuilderOptions = {
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
};

export const buildArkitektProvider =
  (options: ArkitektBuilderOptions) =>
  ({ children }: { children: ReactNode }) => {
    return (
      <ArkitektProvider
        manifest={options.manifest}
        serviceBuilderMap={options.serviceBuilderMap}
      >
        {children}
      </ArkitektProvider>
    );
  };
