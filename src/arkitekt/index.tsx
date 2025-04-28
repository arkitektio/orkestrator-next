import { FaktsGuard, FaktsProps, Manifest, useFakts } from "@/lib/fakts";
import { HerreGuard, HerreProps, useHerre } from "@/lib/herre";

import { buildArkitektConnect, useArkitektLogin } from "./hooks";
import {
  buildArkitektProvider,
  ServiceBuilderMap,
  useArkitekt,
} from "./provider";
import { WidgetRegistry } from "@/rekuest/widgets/Registry";
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
  widgetRegistry,
}: {
  manifest: Manifest;
  serviceBuilderMap: ServiceBuilderMap;
  faktsProps?: Partial<FaktsProps>;
  herreProps?: Partial<HerreProps>;
  widgetRegistry?: WidgetRegistry;
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
    useWidgetRegistry: () => widgetRegistry,
    useToken: () => useHerre().token,
    useConnect: buildArkitektConnect(manifest, serviceBuilderMap),
    useServices: () => useArkitekt().availableServices,
  };
};
