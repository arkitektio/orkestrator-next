import { Button } from "@/components/ui/button";
import { Arkitekt } from "@/app/Arkitekt";
import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Server } from "lucide-react";
import React from "react";
import { discoverBeaconProbes, discoverFromProbe } from "./discovery";
import { getStoredProbes, removeProbe, storeProbe } from "./storage";
import { defaultProbes, ProbeResult, ProbeStatus } from "./types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ProbeCard } from "./ProbeCard";

export const EndpointsWidget = () => {
  const connect = Arkitekt.useConnect();
  const autoLoginError = Arkitekt.useAutoLoginError();
  const [probeResults, setProbeResults] = React.useState<ProbeResult[]>([]);
  const [isDiscovering, setIsDiscovering] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  React.useEffect(() => {
    const discoverEndpoints = async () => {
      setIsDiscovering(true);

      try {
        const storedProbes = getStoredProbes();
        const beaconProbes = await discoverBeaconProbes();

        const allProbes = [
          ...defaultProbes,
          ...storedProbes,
          ...beaconProbes,
        ].filter(
          (probe, index, self) =>
            index === self.findIndex((p) => p.base_url === probe.base_url),
        );

        const initialResults: ProbeResult[] = allProbes.map((probe) => ({
          probe,
          status: "checking" as ProbeStatus,
        }));

        setProbeResults(initialResults);

        const discoveryPromises = allProbes.map((probe) =>
          discoverFromProbe(probe),
        );

        const discoveredResults = await Promise.all(discoveryPromises);
        setProbeResults(discoveredResults);
      } catch (error) {
        console.error("Error during discovery:", error);
      } finally {
        setIsDiscovering(false);
      }
    };

    discoverEndpoints();
  }, [refreshKey]);

  const handleConnect = async (endpoint: FaktsEndpoint) => {
    try {
      const successfulProbe = probeResults.find(
        (result) => result.endpoint?.base_url === endpoint.base_url,
      )?.probe;

      await connect({
        endpoint,
        controller: new AbortController(),
      });

      if (successfulProbe) {
        storeProbe(successfulProbe);
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleRemove = (baseUrl: string) => {
    removeProbe(baseUrl);
    setRefreshKey((prev) => prev + 1);
  };

  const handleRetry = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const discoveredResults = probeResults.filter(
    (result) => result.status === "discovered",
  );
  const unreachableResults = probeResults.filter(
    (result) => result.status === "unreachable",
  );
  const checkingResults = probeResults.filter(
    (result) => result.status === "checking",
  );

  return (
    <div className="space-y-4 w-full max-w-lg">
      {autoLoginError && (
        <div className="flex items-center justify-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{autoLoginError}</span>
        </div>
      )}

      {/* Quick Connect Buttons */}
      <div className="flex flex-col gap-2">
        {discoveredResults.map((result) => (
          <Button
            key={result.probe.base_url}
            onClick={() => result.endpoint && handleConnect(result.endpoint)}
            variant="outline"
            size="lg"
            className="w-full justify-center text-center h-auto py-3"
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{result.probe.base_url}</div>
              <div className="text-xs opacity-80 truncate">
                {result.probe.name}
              </div>
            </div>
          </Button>
        ))}

        {checkingResults.map((result) => (
          <Button
            key={result.probe.base_url}
            disabled
            variant="outline"
            size="lg"
            className="w-full justify-start text-left h-auto py-3"
          >
            <Loader2 className="h-5 w-5 mr-3 flex-shrink-0 animate-spin" />
            <div className="flex-1">
              <div className="font-semibold">{result.probe.name}</div>
              <div className="text-xs opacity-60">Checking...</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Advanced Section */}
      {(unreachableResults.length > 0 || discoveredResults.length > 2) && (
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              <ChevronDown
                className={`h-4 w-4 mr-2 transition-transform ${
                  isAdvancedOpen ? "rotate-180" : ""
                }`}
              />
              Advanced Options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {unreachableResults.map((result) => (
              <ProbeCard
                key={result.probe.base_url}
                probeResult={result}
                onConnect={handleConnect}
                onRemove={handleRemove}
              />
            ))}
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isDiscovering}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isDiscovering ? "animate-spin" : ""}`}
                />
                Retry All
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {discoveredResults.length === 0 && checkingResults.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No endpoints discovered. Try adding a custom endpoint below.
        </div>
      )}
    </div>
  );
};
