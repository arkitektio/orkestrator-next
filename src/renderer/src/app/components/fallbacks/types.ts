import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";

export interface DiscoveryProbe {
  name: string;
  base_url: string;
  description: string;
  source: "default" | "beacon" | "stored";
}

export type ProbeStatus =
  | "checking"
  | "discovered"
  | "unreachable"
  | "connected";

export interface ProbeResult {
  probe: DiscoveryProbe;
  status: ProbeStatus;
  endpoint?: FaktsEndpoint;
  lastChecked?: Date;
  error?: string;
}

export const defaultProbes: DiscoveryProbe[] = [
  {
    name: "Localhost",
    base_url: "http://localhost",
    description: "Connect to your local Arkitekt instance",
    source: "default",
  },
  {
    name: "Dev",
    base_url: "https://go.arkitekt.live",
    description: "Connect to the developmental global Arkitekt instance",
    source: "default",
  },
];

interface ElectronAPI {
  discoverBeacons?: () => Promise<DiscoveryProbe[]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
