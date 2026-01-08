import { useContext } from "react";
import { ArkitektContext } from "./context";
import { Service } from "./types";

export const useArkitekt = () => useContext(ArkitektContext);

export const useService = <T extends string = string >(key: string): Service<T> => {
  const { connection } = useArkitekt();

  if (!connection) {
    throw new Error("Arkitekt not connected");
  }

  if (!connection.clients[key]) {
    throw new Error(`Service ${key} not available`);
  }

  return connection?.clients[key];
};

export const usePotentialService = <T extends string = string >(key: string): Service<T> | undefined => {
  const { connection } = useArkitekt();

  return connection?.clients[key];
};

export const useToken = () => {
  return useArkitekt().connection?.token || null;
};



export const useManifest = () => {
  return useArkitekt().manifest;
}
