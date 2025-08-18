import { StringField } from "@/components/fields/StringField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { discover } from "@/lib/arkitekt/fakts/discover";
import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

export interface DiscoveryProbe {
  name: string;
  base_url: string;
  description: string;
  source: "default" | "beacon" | "stored";
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

export type ProbeStatus =
  | "checking"
  | "discovered"
  | "unreachable"
  | "connected";

export interface ProbeResult {
  probe: DiscoveryProbe;
  status: ProbeStatus;
  endpoint?: FaktsEndpoint; // The actual discovered endpoint
  lastChecked?: Date;
  error?: string;
}

// Storage functions for previously discovered endpoints
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

// Discover endpoint from probe
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

// Type for electron API
interface ElectronAPI {
  discoverBeacons?: () => Promise<DiscoveryProbe[]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// Beacon discovery for Electron (placeholder for future implementation)
export const discoverBeaconProbes = async (): Promise<DiscoveryProbe[]> => {
  // This would implement mDNS/Bonjour discovery in electron
  // For now, return empty array
  try {
    // Check if we're in electron
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

export const ProbeCard = ({
  probeResult,
  onConnect,
  className = "",
}: {
  probeResult: ProbeResult;
  onConnect: (endpoint: FaktsEndpoint) => void;
  className?: string;
}) => {
  const getStatusIcon = () => {
    switch (probeResult.status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "discovered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "unreachable":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "connected":
        return <Wifi className="h-4 w-4 text-blue-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (probeResult.status) {
      case "checking":
        return <Badge variant="secondary">Checking...</Badge>;
      case "discovered":
        return (
          <Badge variant="default" className="bg-green-500">
            Available
          </Badge>
        );
      case "unreachable":
        return <Badge variant="destructive">Unreachable</Badge>;
      case "connected":
        return (
          <Badge variant="default" className="bg-blue-500">
            Connected
          </Badge>
        );
      default:
        return null;
    }
  };

  const isDisabled =
    probeResult.status === "unreachable" ||
    probeResult.status === "checking" ||
    !probeResult.endpoint;

  const handleClick = () => {
    if (!isDisabled && probeResult.endpoint) {
      onConnect(probeResult.endpoint);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-200 ${isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-accent hover:shadow-md"
        } ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg font-bold">
              {probeResult.probe.name}
            </CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-gray-500">
          {probeResult.probe.description || "No description"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 ">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {probeResult.probe && (
              <p className="text-xs text-green-600">
                {probeResult.probe.base_url}
              </p>
            )}
          </div>
          {probeResult.probe.source !== "default" && (
            <Badge variant="outline" className="text-xs">
              {probeResult.probe.source}
            </Badge>
          )}
        </div>
        {probeResult.lastChecked && (
          <p className="text-xs text-gray-400 mt-1">
            Last checked: {probeResult.lastChecked.toLocaleTimeString()}
          </p>
        )}
        {probeResult.error && (
          <p className="text-xs text-red-500 mt-1">
            Error: {probeResult.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const PreconfiguredEndpointsWidget = () => {
  const connect = Arkitekt.useConnect();
  const [probeResults, setProbeResults] = React.useState<ProbeResult[]>([]);
  const [isDiscovering, setIsDiscovering] = React.useState(false);

  // Load and probe all sources
  React.useEffect(() => {
    const discoverEndpoints = async () => {
      setIsDiscovering(true);

      try {
        // Collect all probes from different sources
        const storedProbes = getStoredProbes();
        const beaconProbes = await discoverBeaconProbes();

        // Combine all probes, avoiding duplicates
        const allProbes = [
          ...defaultProbes,
          ...storedProbes,
          ...beaconProbes,
        ].filter(
          (probe, index, self) =>
            index === self.findIndex((p) => p.base_url === probe.base_url),
        );

        // Initialize results with checking status
        const initialResults: ProbeResult[] = allProbes.map((probe) => ({
          probe,
          status: "checking" as ProbeStatus,
        }));

        setProbeResults(initialResults);

        // Discover endpoints from each probe
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
  }, []);

  const handleConnect = async (endpoint: FaktsEndpoint) => {
    try {
      // Store the probe that led to this successful connection
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
      // Reset status on failure
    }
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
    <div className="grid grid-cols-1 gap-4">
      {/* Show checking status */}
      {isDiscovering && checkingResults.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Discovering endpoints...
        </div>
      )}

      {discoveredResults.map((result) => (
        <ProbeCard
          key={result.probe.base_url}
          probeResult={result}
          onConnect={handleConnect}
        />
      ))}
      {checkingResults.map((result) => (
        <ProbeCard
          key={result.probe.base_url}
          probeResult={result}
          onConnect={handleConnect}
        />
      ))}


      {unreachableResults.map((result) => (
        <ProbeCard
          key={result.probe.base_url}
          probeResult={result}
          onConnect={handleConnect}
          className="grayscale"
        />
      ))}
    </div>
  );
};

export const NotConnected = () => {
  const connect = Arkitekt.useConnect();

  const [introspectError, setIntrospectError] = React.useState<string | null>(
    null,
  );

  const location = useLocation();

  const form = useForm({
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: { url: string }) => {
    setIntrospectError(null);
    const controller = new AbortController();

    discover({ url: data.url, timeout: 2000, controller })
      .then((endpoint) => {
        // Store successful probe for future use
        const probe: DiscoveryProbe = {
          name: endpoint.name || "Custom endpoint",
          base_url: data.url,
          description: endpoint.description || "Custom endpoint",
          source: "stored",
        };
        storeProbe(probe);

        connect({
          endpoint,
          controller,
        }).catch((e) => {
          setIntrospectError(e.message);
        });
      })
      .catch((e) => {
        setIntrospectError(e.message);
      });
  };

  return (
    <div className="flex flex-col w-full h-full flex items-center justify-center">
      <div className="flex flex-col max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Hi Stranger :)
            </h1>
            <h2 className="text-2xl font-light tracking-tighter sm:text-3xl md:text-4xl text-foreground">
              Welcome to Arkitekt.
            </h2>
            {location.pathname != "/" ? (
              <>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Before accessing this beautiful page you need to connect to a
                  local server.
                </p>

                <div className="flex items-center justify-center space-x-2 text-foreground">
                  <b className="text-primary mr-2">{location.pathname}</b> is
                  waiting for you ;)
                </div>
              </>
            ) : (
              <>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  To get started, connect to a local or production Arkitekt
                  instance.
                </p>
              </>
            )}
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Available Endpoints
              </h3>
            </div>

            <PreconfiguredEndpointsWidget />
            <p className="mx-auto text-gray-500 md:text-sm/relaxed sm:text-base/relaxed sm:text-sm/relaxed dark:text-gray-400">
              Not the endpoint you are looking for? You can also connect to a
              custom endpoint.
            </p>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"secondary"}> Advanced Login</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle> Log in to a known server?</SheetTitle>
                  <SheetDescription>
                    <div className="space-y-4">
                      <p className=" dark:text-gray-400">
                        Enter the adress of your erver to connect.
                      </p>

                      {introspectError && (
                        <div className="bg-red-100 text-red-900 p-2 rounded-md">
                          Could not connect to the server
                          <p className="text-xs">{introspectError}</p>
                        </div>
                      )}
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                          <div className="grid w-full max-w-sm gap-2">
                            <StringField
                              name="url"
                              description="The local server url"
                            />
                            <Button
                              className="w-full"
                              type="submit"
                              variant={"secondary"}
                            >
                              Connect
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};
