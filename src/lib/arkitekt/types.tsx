import { Ward } from "@/rekuest/widgets/WidgetsContext";
import { ApolloClient } from "@apollo/client";
import { FaktsEndpoint } from "./fakts/endpointSchema";
import { ActiveFakts, Alias, Instance } from "./fakts/faktsSchema";
import { Manifest } from "./fakts/manifestSchema";

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

export type Service = {
  ward?: Ward;
  alias?: Alias;
  instance?: Instance;
  client: unknown;
};

export type Token = string;

export type ServiceBuilder<T> = (options: {
  manifest: Manifest;
  instance: Instance;
  alias: Alias;
  fakts: ActiveFakts;
  token: Token;
}) => T;


export type ServiceDefinition<T extends Service = Service> = {
  builder: ServiceBuilder<T>;
  key: string;
  service: string;
  omitchallenge?: boolean;
  forceinsecure?: boolean;
  optional: boolean;
};

export type ServiceBuilderMap<T extends Record<string, ServiceDefinition> = Record<string, ServiceDefinition>> = {
  [K in keyof T]: T[K];
};

export type ServiceMap<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: Service<T[K]>;
};

export type AliasReport = {
  valid: boolean;
  alias_id?: string;
  reason?: string;
};

export type ReportRequest = {
  alias_reports: { [key: string]: AliasReport };
  token: string;
  functional: boolean;
};



export type EnhancedManifest = Manifest & {
  node_id: string;
};


// Context Types

export type ConnectedContext<T extends Record<string, any> = Record<string, any>> = {
  fakts: ActiveFakts;
  manifest: EnhancedManifest;
  clients: ServiceMap<T>;
  aliasReports: { [key: string]: AliasReport };
  token: Token;
  availableServices: AvailableService[];
  unresolvedServices?: UnresolvedService[];
  endpoint: FaktsEndpoint;
};

export type ConnectFunction<T extends Record<string, any> = Record<string, any>> = (options: {
  endpoint: FaktsEndpoint;
  controller: AbortController;
}) => Promise<AppContext<T>>;

export type DisconnectFunction = () => Promise<void>;

export type AppContext<T extends Record<string, any> = Record<string, any>> = {
  manifest: EnhancedManifest;
  connection?: ConnectedContext<T>;
};

export type AppFunctions<T extends Record<string, any> = Record<string, any>> = {
  connect: ConnectFunction<T>;
  disconnect: DisconnectFunction;
  reconnect: () => Promise<void>;
  connecting?: boolean;
};

export type ArkitektContextType<T extends Record<string, any> = Record<string, any>> = AppContext<T> & AppFunctions<T>;
