import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { aliasToHttpPath } from "@/lib/arkitekt/alias/helpers";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { Instance } from "@/lib/arkitekt/fakts/faktsSchema";
import { useMyContextQuery } from "@/lok-next/api/graphql";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Loader2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type ServiceCardProps = {
  instance: Instance;
  serviceKey: string;
};

const ServiceWidget = (props: ServiceCardProps) => {
  const [health, setHealth] = useState<boolean | null>(null);
  const [healthyAliases, setHealthyAliases] = useState<number>(0);
  const [totalAliases, setTotalAliases] = useState<number>(0);

  useEffect(() => {
    const aliases = props.instance.aliases;
    setTotalAliases(aliases.length);

    if (aliases.length === 0) {
      setHealth(false);
      return;
    }

    // Check all aliases
    const aliasChecks = aliases.map(async (alias) => {
      try {
        const healthUrl = aliasToHttpPath(alias, alias.challenge);
        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(healthUrl, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        console.error(`Health check failed for alias ${alias.host}:`, error);
        return false;
      }
    });

    Promise.all(aliasChecks).then((results) => {
      const healthyCount = results.filter(Boolean).length;
      setHealthyAliases(healthyCount);
      setHealth(healthyCount > 0); // Service is healthy if at least one alias is healthy
    });
  }, [props]);

  const getHealthIcon = () => {
    if (health === null)
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (health) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getHealthBadge = () => {
    if (health === null) return <Badge variant="secondary">Checking...</Badge>;
    if (health) {
      const allHealthy = healthyAliases === totalAliases;
      return (
        <Badge
          variant="default"
          className={allHealthy ? "bg-green-500" : "bg-yellow-500"}
        >
          {allHealthy
            ? "Healthy"
            : `Partial (${healthyAliases}/${totalAliases})`}
        </Badge>
      );
    }
    return <Badge variant="destructive">Unhealthy</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-md">{props.instance.service}</CardTitle>
          </div>
          {getHealthBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {getHealthIcon()}
          <span className="text-sm text-muted-foreground">
            Service Status:{" "}
            {health === null ? "Checking" : health ? "Operational" : "Down"}
          </span>
        </div>
        {totalAliases > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-muted-foreground">
              Aliases: {healthyAliases}/{totalAliases} healthy
            </p>
            {props.instance.aliases.map((alias, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                {alias.ssl ? "https" : "http"}://{alias.host}
                {alias.port ? `:${alias.port}` : ""}
                {alias.path || ""}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ServiceInfo = (props: { value: Instance; serviceKey: string }) => {
  return <ServiceWidget instance={props.value} serviceKey={props.serviceKey} />;
};

export const ServerHealthInfo = () => {
  const { data } = useMyContextQuery({
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="space-y-6">
      {/* User/Organization Info */}
      <div className="grid md:grid-cols-1 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <CardTitle>User Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-medium">
                {data?.mycontext?.user.username || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-sm">
                {data?.mycontext?.user.id || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-500" />
              <CardTitle>Organization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {data?.mycontext?.organization?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization ID:</span>
              <span className="font-mono text-sm">
                {data?.mycontext?.organization?.id || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="text-md font-semibold mb-2">Available Services</h3>
          <p className="text-muted-foreground text-sm">
            Status and health information for connected services
          </p>
        </div>

        <ServicesInfo />
      </div>
    </div>
  );
};
export const ServicesInfo = () => {
  const fakts = Arkitekt.useFakts();

  const listedServices = fakts
    ? Object.keys(fakts.instances)
        .map((key) => {
          return {
            serviceKey: key,
            value: fakts.instances[key as keyof typeof fakts],
          };
        })
        .filter((e) => e.serviceKey)
    : [];

  return (
    <ScrollArea className="grid grid-cols-1 gap-4 overflow-y-scroll">
      {listedServices.map((service) => {
        return <ServiceInfo key={service.serviceKey} {...service} />;
      })}
    </ScrollArea>
  );
};

export const Home = () => {
  const fakts = Arkitekt.useFakts();
  const connection = Arkitekt.useConnection();
  const disconnect = Arkitekt.useDisconnect();
  const reconnect = Arkitekt.useReconnect();

  const { data } = useMyContextQuery({
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="min-h-screen w-full h-full bg-radial-[at_100%_100%] from-background to-backgroundpaired  flex items-center justify-center">
      <div className="container mx-auto my-auto px-4 py-16 min-h-screen flex flex-col">
        <div className="max-w-6xl mx-auto my-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-foreground">Welcome back,</span>
                <br />
                <span className="text-foreground">
                  {data?.mycontext?.user.username || "User"}
                </span>
              </h1>

              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  You are currently connected to{" "}
                  <Tooltip>
                    <TooltipTrigger className="cursor-pointer">
                      <span className="cursor-default font-semibold text-foreground">
                        {fakts?.self?.deployment_name || "Arkitekt Server"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {connection?.endpoint?.base_url}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {data?.mycontext?.organization && (
                    <>
                      {" "}
                      and working with{" "}
                      <span className="font-semibold text-foreground">
                        {data.mycontext.organization.name}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <Button
                  onClick={reconnect}
                  variant="default"
                  size="lg"
                  className="text-base"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Switch User/Organization
                </Button>
                <Button
                  onClick={disconnect}
                  variant="outline"
                  size="lg"
                  className="text-base"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>

                {/* Server Health Button with Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="lg" className="text-base">
                      <Heart className="w-4 h-4 mr-2" />
                      Inspect
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto ">
                    <SheetHeader>
                      <SheetTitle>Server Health Information</SheetTitle>
                      <SheetDescription>
                        Overview of connected services and their status
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ServerHealthInfo />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * This is the hero component, which is the main page of the public application.
 * @todo: This component should be replaced with a more useful component for the public application.
 */
function Page() {
  return (

    <div className="min-h-screen w-full">
      <Home />
    </div>
  );
}

export default Page;
