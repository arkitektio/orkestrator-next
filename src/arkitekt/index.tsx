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

export const Arkitekt = {
  Provider: ArkitektProvider,
  withKabinet: withKabinet,
  KabinetGuard: KabinetGuard,
};
