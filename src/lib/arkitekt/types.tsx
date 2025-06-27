import { Manifest } from "@/lib/fakts";
import { ApolloCache } from "@apollo/client";

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
