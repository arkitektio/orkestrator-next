import { ArkitektProvider, useArkitekt } from "./provider";

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

export const Arkitekt = {
  Provider: ArkitektProvider,
  withKabinet: withKabinet,
  withLok: buildWith("lok"),
  KabinetGuard: KabinetGuard,
  LokNextGuard: buildGuard("lok"),
};
