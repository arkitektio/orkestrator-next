import { useArkitektConnect, useArkitektLogin } from "@jhnnsrs/arkitekt";
import { Manifest } from "@jhnnsrs/fakts";
import { withRekuest } from "@jhnnsrs/rekuest-next";

export type App = {
  useLogin: typeof useArkitektLogin;
  useConnect: typeof useArkitektConnect;
  withRekuest: typeof withRekuest;
};

export const buildApp = (manifest: Manifest): App => {
  return {
    useLogin: useArkitektLogin,
    useConnect: useArkitektConnect,
    withRekuest: withRekuest,
  };
};
