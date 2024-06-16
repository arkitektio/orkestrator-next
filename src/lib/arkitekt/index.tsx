import { useArkitektConnect, useArkitektLogin } from "@jhnnsrs/arkitekt";
import { FaktsEndpoint, Manifest } from "@jhnnsrs/fakts";
import { withRekuest } from "@jhnnsrs/rekuest-next";

export type MikroInfo = {
  endpoint_url: string;
  ws_endpoint_url: string;
};

export type Fakts = {
  mikro: MikroInfo;
  rekuest: MikroInfo;
  self: {
    deployment_name?: string;
    welcome_message?: string;
  };
};

export type Endpoint = FaktsEndpoint & {
  name: string;
  description?: string;
};

export type App = {
  useLogin: typeof useArkitektLogin;
  useConnect: () => Omit<
    ReturnType<typeof useArkitektConnect>,
    "fakts" | "registeredEndpoints"
  > & {
    fakts?: Fakts | null;
    registeredEndpoints: Endpoint[];
  };
  withRekuest: typeof withRekuest;
};

export const buildApp = (manifest: Manifest): App => {
  return {
    useLogin: useArkitektLogin,
    useConnect: useArkitektConnect,
    withRekuest: withRekuest,
  };
};
