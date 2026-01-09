import { discover } from "@/lib/arkitekt/fakts/discover";
import { DiscoveryProbe, ProbeResult } from "./types";

export const discoverFromProbe = async (
  probe: DiscoveryProbe,
  timeout = 2000,
): Promise<ProbeResult> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const endpoint = await discover({
      url: probe.base_url,
      controller,
      timeout,
    });

    clearTimeout(timeoutId);
    return {
      probe,
      status: "discovered",
      endpoint,
      lastChecked: new Date(),
    };
  } catch (error) {
    console.warn("Probe discovery failed:", error);
    return {
      probe,
      status: "unreachable",
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : "Discovery failed",
    };
  }
};

export const discoverBeaconProbes = async (): Promise<DiscoveryProbe[]> => {
  try {
    if (window.electronAPI?.discoverBeacons) {
      const beacons = await window.electronAPI.discoverBeacons();
      return beacons.map((beacon: DiscoveryProbe) => ({
        ...beacon,
        source: "beacon" as const,
      }));
    }
  } catch (error) {
    console.warn("Beacon discovery not available:", error);
  }
  return [];
};
