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
  defaultZoomLevel: zod.number().min(0.25).max(3.0),
  startAgent: zod.boolean(),
  agentExpanded: zod.boolean().optional(),
  primaryColor: zod.string().optional(),
});

export const defaultSettings: Settings = {
  autoResolve: true,
  allowAutoRequest: true,
  allowBatch: true,
  darkMode: true,
  colorScheme: "red",
  primaryColor: "oklch(0.60 0.13 163)",
  experimental: false,
  pollInterval: 3000,
  instanceId: "main",
  experimentalViv: false,
  experimentalCache: false,
  defaultZoomLevel: 0.8,
  startAgent: true,
  agentExpanded: false,
};

export type Settings = zod.infer<typeof settingsValidator>;
