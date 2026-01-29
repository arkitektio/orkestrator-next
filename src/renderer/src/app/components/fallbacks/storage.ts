import { DiscoveryProbe } from "./types";

export const getStoredProbes = (): DiscoveryProbe[] => {
  try {
    const stored = localStorage.getItem("discoveryProbes");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading stored probes:", error);
    return [];
  }
};

export const storeProbe = (probe: DiscoveryProbe) => {
  try {
    const stored = getStoredProbes();
    const exists = stored.find((p) => p.base_url === probe.base_url);

    if (!exists) {
      const newProbe: DiscoveryProbe = {
        ...probe,
        source: "stored",
      };
      stored.push(newProbe);
      localStorage.setItem("discoveryProbes", JSON.stringify(stored));
    }
  } catch (error) {
    console.error("Error storing probe:", error);
  }
};

export const removeProbe = (baseUrl: string) => {
  try {
    const stored = getStoredProbes();
    const filtered = stored.filter((p) => p.base_url !== baseUrl);
    localStorage.setItem("discoveryProbes", JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing probe:", error);
  }
};
