import React, { ReactNode, useEffect, useRef, useState } from "react";
import { checkAliasHealth } from "./alias/resolve";
import { buildAliases } from "./builder";
import { ArkitektContext } from "./context";
import { AliasStorageSchema } from "./fakts/aliasStorageSchema";
import { FaktsEndpoint, FaktsEndpointSchema } from "./fakts/endpointSchema";
import { ActiveFakts, ActiveFaktsSchema, Alias } from "./fakts/faktsSchema";
import { flow } from "./fakts/flow";
import { Manifest } from "./fakts/manifestSchema";
import { TokenResponseSchema } from "./fakts/tokenSchema";
import { useArkitekt } from "./hooks";
import { login } from "./oauth/login";
import { AppContext, EnhancedManifest, ReportRequest, Service, ServiceBuilderMap, ServiceDefinition } from "./types";
import { enhanceManifest, report } from "./utils";

export type AliasMap = {
  [key: string]: Alias;
};

export type ServiceMap = {
  [key: string]: Service;
};

export const buildServiceMap = ({map, manifest, aliasMap, token, fakts}: {map: ServiceBuilderMap, manifest: EnhancedManifest, aliasMap: AliasMap, token: string, fakts: ActiveFakts}): ServiceMap => {
  const services: ServiceMap= {};

  for (const key in map) {
    const def: ServiceDefinition = map[key];
    if (!aliasMap[key]) {
      if (def.optional) {
        console.warn(`Optional service ${key} has no alias, skipping`);
        continue;
      } else {
        throw new Error(`No alias found for required service: ${key}`);
      }
    }
    services[key] = def.builder({
      manifest,
      alias: aliasMap[key],
      fakts: fakts,
      token: token
    }
    )
  }

  return services;;
}


export const aliasMapStillValidForManifest = (aliasMap: AliasMap, enhancedManifest: EnhancedManifest): boolean => {
  return enhancedManifest.requirements.every((req) => {
    if (req.optional) return true;
    const alias = aliasMap[req.key];

    return alias !== undefined;
  });
}

export const mappedAliasesStillReachable = async ({aliasMap, controller, timeout}: {aliasMap: AliasMap, controller: AbortController, timeout: number}): Promise<boolean> => {
  const checkPromises = Object.values(aliasMap).map(async (alias) => {
    try {
      const response = await checkAliasHealth(alias, timeout,  controller);
      return response
    } catch (e: Error | unknown) {
      console.warn(`Alias health check failed: ${alias.host}`, (e as Error).message);
      return false;
    }
  });

  return await Promise.all(checkPromises).then((results) => results.every((res) => res));
}


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
    manifest: manifest as EnhancedManifest,
    connection: undefined,
  });
  const [connecting, setConnecting] = useState(false);

  const connectingRef = useRef<boolean>(false);

  const connect = async (options: {
    endpoint: FaktsEndpoint;
    controller: AbortController;
  }): Promise<AppContext> => {
    // Build Manifest
try {

    setConnecting(true);
    localStorage.setItem("endpoint", JSON.stringify(options.endpoint));


    const enhancedManifest = await enhanceManifest(manifest);

    const fakts = await flow({
      endpoint: options.endpoint,
      controller: options.controller,
      manifest: enhancedManifest,
    });

    // Save fakts to local storage
    localStorage.setItem("fakts", JSON.stringify(fakts));


    const token = await login(fakts.auth);

    localStorage.setItem("token", JSON.stringify(token));


    const { aliasReports, aliasMap, functional } = await buildAliases({
      fakts,
      manifest: enhancedManifest,
      controller: options.controller,
    });

    localStorage.setItem("aliasReports", JSON.stringify({aliasMap: aliasMap}));


    const reportRequest : ReportRequest = {
      alias_reports: aliasReports,
      token: fakts.auth.client_token,
      functional: functional,
    };

    await report(fakts.auth.report_url, reportRequest);

    if (!functional) {
      throw new Error("Could not connect to all required services");
    }


    const serviceMap = buildServiceMap({
      map: serviceBuilderMap,
      manifest: enhancedManifest,
      aliasMap: aliasMap,
      token: token.access_token,
      fakts: fakts,
    });


    const context : AppContext = {
      manifest: enhancedManifest,
      connection: {
        endpoint: options.endpoint,
        fakts: fakts,
        manifest: enhancedManifest,
        serviceMap: serviceMap,
        aliasMap: aliasMap,
        serviceBuilderMap: serviceBuilderMap,
        token: token.access_token,
      },
    };




      setContext(context);

      return context;
    } catch (e) {
      console.error("Connection failed:", e);
      throw e;
    } finally {
      setConnecting(false);
    }

  };

  const disconnect = async () => {
    setContext(
      { manifest: context.manifest, connection: undefined }
    );
    localStorage.removeItem("fakts");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      const isReloadKey = e.key === "x" && (e.ctrlKey || e.metaKey);

      if (isReloadKey) {
        e.preventDefault(); // prevent default reload
        console.log("Reloading Arkitekt context...");

        if (context.connection) {
          for (const key in context.connection.serviceMap) {
            const service = context.connection.serviceMap[key];
            console.log(`Clearing service: ${key}`, service);
            if (service.client) {
              try {
              console.log(`Clearing store for apollo: ${key}`);
              await service.client.clearStore(); // stops the Apollo clien
              await service.client.resetStore();
              } catch (err) {
                console.warn(`Failed to clear store for service ${key}:`, err);
            }
          }
          }
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [context.connection]);

  const reconnect = async () => {
    const oldEndpoint = localStorage.getItem("endpoint");
    if (!oldEndpoint) {
      throw new Error("No endpoint found in local storage");
    }
    const endpoint: FaktsEndpoint = JSON.parse(oldEndpoint);
    const options = { controller: new AbortController(), endpoint: endpoint };

    await connect({ ...options, endpoint });
  };

  const tryReconnect = async ({manifest, serviceBuilderMap, controller}: {manifest: EnhancedManifest, serviceBuilderMap: ServiceBuilderMap, controller: AbortController}) => {
    const faktsRaw = localStorage.getItem("fakts");
    const tokenRaw = localStorage.getItem("token");
    const endpointRaw = localStorage.getItem("endpoint");
    const aliasReportsRaw = localStorage.getItem("aliasReports");

    if (!faktsRaw || !tokenRaw || !endpointRaw || !aliasReportsRaw) return;

    setConnecting(true);

    try {

      const fakts = ActiveFaktsSchema.parse(JSON.parse(faktsRaw));
      const token = TokenResponseSchema.parse(JSON.parse(tokenRaw));
      const endpoint = FaktsEndpointSchema.parse(JSON.parse(endpointRaw));
      const aliasStorage = AliasStorageSchema.parse(JSON.parse(aliasReportsRaw));

      if (!aliasMapStillValidForManifest(aliasStorage.aliasMap, manifest)) {
       throw new Error("Stored aliases no longer valid for manifest");
      }

      const stillReachable = await mappedAliasesStillReachable({
        aliasMap: aliasStorage.aliasMap,
        controller: controller,
        timeout: 2000,
      });

      let currentAliasMap = aliasStorage.aliasMap;

      if (!stillReachable) {
        const { aliasReports, aliasMap, functional } = await buildAliases({
            fakts,
            manifest: manifest,
            controller: controller,
        });

        const reportRequest : ReportRequest = {
          alias_reports: aliasReports,
          token: fakts.auth.client_token,
          functional: functional,
        };

        localStorage.setItem("aliasReports", JSON.stringify({aliasMap: aliasMap}));
        if (!functional) {
          throw new Error("Could not connect to all required services");
        }

        await report(fakts.auth.report_url, reportRequest);

        currentAliasMap = aliasMap;

      }


      const serviceMap = buildServiceMap({
        map: serviceBuilderMap,
        manifest: manifest,
        aliasMap: currentAliasMap,
        token: token.access_token,
        fakts: fakts,
      });
      const context : AppContext = {
        manifest: manifest,
        connection: {
          endpoint: endpoint,
          fakts: fakts,
          manifest: manifest,
          aliasMap: currentAliasMap,
          serviceBuilderMap: serviceBuilderMap,
          serviceMap: serviceMap,
          token: token.access_token,
        },
      };

      setContext(context);
      setConnecting(false);
    } catch (e) {
      console.warn("Auto-login failed:", e);
      localStorage.removeItem("fakts");
      localStorage.removeItem("token");
      setConnecting(false);
    }
  };

  // 🔁 Auto-login effect on mount
  useEffect(() => {
    if (!connectingRef.current) {
      connectingRef.current = true;
      const controller = new AbortController();
      enhanceManifest(manifest).then((enhancedManifest) => {
        tryReconnect({manifest: enhancedManifest, serviceBuilderMap, controller});
      });

      return () => {
        controller.abort();
      }
    }
  }, [manifest, serviceBuilderMap]);

  return (
    <ArkitektContext.Provider
      value={{ ...context, connect, disconnect, reconnect, connecting }}
    >
      {children}
    </ArkitektContext.Provider>
  );
};

export type ConnectedGuardProps = {
  notConnectedFallback?: React.ReactNode;
  connectingFallback?: React.ReactNode;
};

export const ConnectedGuard = ({
  notConnectedFallback = "Not Connected",
  connectingFallback = "Loading...",
  children,
}: ConnectedGuardProps & { children: ReactNode }) => {
  const { connection, connecting } = useArkitekt();

  if (!connection) {
    if (connecting) {
      return <>{connectingFallback}</>;
    }
    return <>{notConnectedFallback}</>;
  }

  return <>{children}</>;
};

export type ArkitektBuilderOptions<T extends ServiceBuilderMap> = {
  manifest: Manifest;
  serviceBuilderMap: T;
};

export const buildArkitektProvider =
  <T extends ServiceBuilderMap>(options: ArkitektBuilderOptions<T>) =>
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

export { ArkitektContext } from "./context";
export * from "./hooks";
export * from "./types";

