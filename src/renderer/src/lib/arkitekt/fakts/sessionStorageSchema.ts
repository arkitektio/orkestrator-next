import { z } from "zod";
import { AliasStorage, AliasStorageSchema } from "./aliasStorageSchema";
import { FaktsEndpoint, FaktsEndpointSchema } from "./endpointSchema";
import { ActiveFakts, ActiveFaktsSchema } from "./faktsSchema";
import { TokenResponse, TokenResponseSchema } from "./tokenSchema";

export const ArkitektStorageKeys = {
  endpoint: "endpoint",
  fakts: "fakts",
  token: "token",
  aliasMap: "aliasMap",
} as const;

export type ArkitektStorageKey =
  (typeof ArkitektStorageKeys)[keyof typeof ArkitektStorageKeys];

export const StoredArkitektSessionSchema = z.object({
  endpoint: FaktsEndpointSchema,
  fakts: ActiveFaktsSchema,
  token: TokenResponseSchema,
  aliasMap: AliasStorageSchema,
});

export type StoredArkitektSession = z.infer<typeof StoredArkitektSessionSchema>;

function loadStoredItem(
  storageKey: ArkitektStorageKey,
  storage: Storage = localStorage,
): unknown | null {
  const rawValue = storage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue);
}

function parseStoredItem<T>(
  storageKey: ArkitektStorageKey,
  schema: z.ZodType<T>,
  storage: Storage = localStorage,
): T | null {
  const rawValue = storage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  return schema.parse(JSON.parse(rawValue));
}

function storeValidatedItem<T>(
  storageKey: ArkitektStorageKey,
  schema: z.ZodType<T>,
  value: T,
  storage: Storage = localStorage,
): void {
  const parsedValue = schema.parse(value);
  storage.setItem(storageKey, JSON.stringify(parsedValue));
}

export function clearStoredArkitektStorage(
  keys: ArkitektStorageKey[] = Object.values(ArkitektStorageKeys) as ArkitektStorageKey[],
  storage: Storage = localStorage,
): void {
  keys.forEach((key) => storage.removeItem(key));
}

export function loadStoredEndpoint(
  storage: Storage = localStorage,
): FaktsEndpoint | null {
  return parseStoredItem(ArkitektStorageKeys.endpoint, FaktsEndpointSchema, storage);
}

export function writeStoredEndpoint(
  endpoint: FaktsEndpoint,
  storage: Storage = localStorage,
): void {
  storeValidatedItem(ArkitektStorageKeys.endpoint, FaktsEndpointSchema, endpoint, storage);
}

export function writeStoredFakts(
  fakts: ActiveFakts,
  storage: Storage = localStorage,
): void {
  storeValidatedItem(ArkitektStorageKeys.fakts, ActiveFaktsSchema, fakts, storage);
}

export function writeStoredToken(
  token: TokenResponse,
  storage: Storage = localStorage,
): void {
  storeValidatedItem(ArkitektStorageKeys.token, TokenResponseSchema, token, storage);
}

export function writeStoredAliasMap(
  aliasMap: AliasStorage,
  storage: Storage = localStorage,
): void {
  storeValidatedItem(ArkitektStorageKeys.aliasMap, AliasStorageSchema, aliasMap, storage);
}

export function writeStoredArkitektSession(
  session: StoredArkitektSession,
  storage: Storage = localStorage,
): void {
  const parsedSession = StoredArkitektSessionSchema.parse(session);
  writeStoredEndpoint(parsedSession.endpoint, storage);
  writeStoredFakts(parsedSession.fakts, storage);
  writeStoredToken(parsedSession.token, storage);
  writeStoredAliasMap(parsedSession.aliasMap, storage);
}

export function loadStoredArkitektSession(
  storage: Storage = localStorage,
): Record<string, unknown> | null {
  const endpoint = loadStoredItem(ArkitektStorageKeys.endpoint, storage);
  const fakts = loadStoredItem(ArkitektStorageKeys.fakts, storage);
  const token = loadStoredItem(ArkitektStorageKeys.token, storage);
  const aliasMap = loadStoredItem(ArkitektStorageKeys.aliasMap, storage);

  if (!endpoint || !fakts || !token || !aliasMap) {
    return null;
  }

  return {
    endpoint,
    fakts,
    token,
    aliasMap,
  };
}