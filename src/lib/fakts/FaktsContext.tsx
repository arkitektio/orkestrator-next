import React, { useContext } from "react";
export type HealthyJSON = { [element: string]: string };
export type FaktsEndpoint = {
  base_url: string;
  name: string;
};

export type Beacon = {
  url: string;
};

export type Manifest = {
  version: string;
  identifier: string;
  scopes: string[];
  logo?: string;
  requirements: {
    key: string;
    service: string;
    optional?: boolean;
  }[];
};

export type Token = string;

export type Closable = {
  close: () => Promise<void>;
};

export type ClientTypes = "website" | "desktop" | "development";

export type BaseFaktsRequest = {
  url?: string;
  endpoint?: FaktsEndpoint;
  manifest: Manifest;
  onProgress?: (progress: string) => void;
  maxRetrievalAttempts?: number;
  maxChallengeRetries?: number;
  introspecTimeout?: number;
  challengeTimeout?: number;
  retrieveTimeout?: number;
  requestedClientType?: ClientTypes;
  requestPublic?: boolean;
  deviceCodeExpirationTime?: number;
  requestedRedirectURIs?: string[];
  onOpenWindow?: (request: FaktsRequest, code: string) => Closable;
  showAllErrors?: boolean;
};

export type WebsiteFaktsRequest = {
  requestedRedirectURIs: string[];
  requestedClientType: "website";
  requestPublic: boolean;
} & BaseFaktsRequest;

export type DesktopFaktsRequest = {
  requestedClientType: "desktop";
  requestPublic: boolean;
} & BaseFaktsRequest;

export type DevelopmentFaktsRequest = {
  requestedClientType: "development";
} & BaseFaktsRequest;

export type FaktsRequest =
  | WebsiteFaktsRequest
  | DesktopFaktsRequest
  | DevelopmentFaktsRequest;

export type FaktsInstance = {};

export type FaktValue = Fakts | string | number;
export type Fakts = { [key: string]: FaktValue };
export type UnvalidatedFakts = any;

export type Validator = (value: any) => Promise<Fakts>;
export type Discovery = (
  request: FaktsRequest,
  controller: AbortController,
) => Promise<FaktsEndpoint>;
export type Demander = (
  request: FaktsRequest,
  endpoint: FaktsEndpoint,
  controller: AbortController,
) => Promise<Token>;
export type Claimer = (
  request: FaktsRequest,
  endpoitn: FaktsEndpoint,
  token: Token,
  controller: AbortController,
) => Promise<UnvalidatedFakts>;

export type Grant = (
  rekuest: FaktsRequest,
  controller: AbortController,
) => Promise<UnvalidatedFakts>;

export type StorageProvider = {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
};

export type CancelableRequest<T> = {
  cancel: () => void;
  promise: Promise<T>;
};

export type FaktsContext = {
  fakts?: Fakts | null;
  setFakts: (fakts: Fakts | null) => void;
  reset: () => void;
  load: (request: FaktsRequest) => CancelableRequest<Fakts>;
  registeredEndpoints: FaktsEndpoint[];
  registerEndpoints: (endpoint: FaktsEndpoint[]) => () => void;
};

export const FaktsContext = React.createContext<FaktsContext>({
  load: () => {
    return {
      promise: Promise.reject(Error("No FaktsProvider found")),
      cancel: () => {},
    };
  },
  setFakts: () => {
    throw Error("No FaktsProvider found");
  },
  reset() {
    throw Error("No FaktsProvider found");
  },
  registerEndpoints: () => {
    throw Error("No FaktsProvider found");
  },
  registeredEndpoints: [],
});

export const useFakts = () => useContext(FaktsContext);
