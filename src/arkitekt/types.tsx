import { ApolloCache, ApolloClient } from "@apollo/client";
import { Manifest } from "@jhnnsrs/fakts";

export type Service = {
  key: string;
  client: ApolloCache<any>;
};

export type ServiceMap = {
  [key: string]: Service;
};

export type App<T extends ServiceMap> = {
  services: T;
  manifest: Manifest;
};
