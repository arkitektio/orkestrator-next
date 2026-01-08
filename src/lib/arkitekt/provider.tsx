import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ApolloClient } from "@apollo/client";
import { buildContext } from "./builder";
import { ArkitektContext } from "./context";
import { FaktsEndpoint, FaktsEndpointSchema } from "./fakts/endpointSchema";
import { ActiveFakts, ActiveFaktsSchema, Alias } from "./fakts/faktsSchema";
import { flow } from "./fakts/flow";
import { Manifest } from "./fakts/manifestSchema";
import { TokenResponse, TokenResponseSchema } from "./fakts/tokenSchema";
import { useArkitekt } from "./hooks";
import { login } from "./oauth/login";
import { AppContext, EnhancedManifest, ReportRequest, ServiceBuilderMap } from "./types";
import { enhanceManifest, report } from "./utils";

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

export const ArkitektProvider = <T extends Record<string, any> = Record<string, any>>({
  children,
  manifest,
  serviceBuilderMap,
}: {
  children: ReactNode;
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap<T>;
}) => {
  const [context, setContext] = useState<AppContext<T>>({
    manifest: manifest as EnhancedManifest,
    connection: undefined,
  });
  const [connecting, setConnecting] = useState(false);

  const connectingRef = useRef<boolean>(false);

  const connect = async (options: {
    endpoint: FaktsEndpoint;
    controller: AbortController;
  }): Promise<Omit<AppContext<T>, "connect">> => {
    // Build Manifest
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

    setConnecting(true);

    const connectedContext = await buildContext({
      fakts,
      manifest: enhancedManifest,
      serviceBuilderMap,
      token: token.access_token,
      controller: options.controller,
      endpoint: options.endpoint,
    });

    const functional = enhancedManifest.requirements.every((req => {
      return req.optional || connectedContext.aliasReports[req.key]?.valid;
    }))


    const reportRequest : ReportRequest = {
      alias_reports: connectedContext.aliasReports,
      token: fakts.auth.client_token,
      functional: functional,
    };

    await report(fakts.auth.report_url, reportRequest);


    if (functional) {




    setContext((context) => ({
      ...context,
      manifest: enhancedManifest,
      connection: connectedContext,
    }));

    setConnecting(false);
  } else {
      setConnecting(false);
      throw new Error("Could not connect to all required services");
    }

    return {
      ...context,
      manifest: enhancedManifest,
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

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      const isReloadKey = e.key === "x" && (e.ctrlKey || e.metaKey);

      if (isReloadKey) {
        e.preventDefault(); // prevent default reload
        console.log("Reloading Arkitekt context...");

        if (context.connection) {
          for (const key in context.connection.clients) {
            const service = context.connection.clients[key];
            console.log(`Clearing service: ${key}`, service);
            if (service.client instanceof ApolloClient) {
              console.log(`Clearing store for apollo: ${key}`);
              await service.client.clearStore(); // stops the Apollo clien
              await service.client.resetStore();
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

  const tryReconnect = async (manifest: EnhancedManifest, serviceBuilderMap: ServiceBuilderMap<T>) => {
    const faktsRaw = localStorage.getItem("fakts");
    const tokenRaw = localStorage.getItem("token");
    const endpointRaw = localStorage.getItem("endpoint");

    if (!faktsRaw || !tokenRaw || !endpointRaw) return;

    try {
      const fakts: ActiveFakts = ActiveFaktsSchema.parse(JSON.parse(faktsRaw));
      const endpoint: FaktsEndpoint = FaktsEndpointSchema.parse(
        JSON.parse(endpointRaw),
      );
      const token: TokenResponse = TokenResponseSchema.parse(
        JSON.parse(tokenRaw),
      );

      setConnecting(true);

      const controller = new AbortController();

      const connectedContext = await buildContext({
        fakts,
        manifest,
        serviceBuilderMap,
        token: token.access_token,
        controller,
        endpoint: endpoint,
      });

      const functional = manifest.requirements.every((req => {
        return req.optional || connectedContext.aliasReports[req.key]?.valid;
      }))

      if (!functional) {
        throw new Error("Not all required services are functional");
      }

      setConnecting(false);

      setContext({
        manifest,
        connection: connectedContext,
      });
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
      enhanceManifest(manifest).then((enhancedManifest) => {
        tryReconnect(enhancedManifest, serviceBuilderMap);
      });
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
  <T extends Record<string, any> = Record<string, any>>(options: ArkitektBuilderOptions<T>) =>
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

export * from "./types";
export * from "./hooks";
export { ArkitektContext } from "./context";
