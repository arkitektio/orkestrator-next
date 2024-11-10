import * as zod from "zod";

export const settingsValidator = zod.object({
  autoResolve: zod.boolean(),
  allowAutoRequest: zod.boolean(),
  allowBatch: zod.boolean(),
  darkMode: zod.boolean(),
  colorScheme: zod.string(),
  experimental: zod.boolean(),
  pollInterval: zod.number(),
  instanceId: zod.string(),
  experimentalViv: zod.boolean(),
  experimentalCache: zod.boolean(),
});

export const defaultSettings: Settings = {
  autoResolve: true,
  allowAutoRequest: true,
  allowBatch: true,
  darkMode: true,
  colorScheme: "red",
  experimental: false,
  pollInterval: 3000,
  instanceId: "main",
  experimentalViv: false,
  experimentalCache: false,
};

export type Settings = zod.infer<typeof settingsValidator>;
