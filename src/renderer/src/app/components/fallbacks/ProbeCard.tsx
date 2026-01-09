import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaktsEndpoint } from "@/lib/arkitekt/fakts/endpointSchema";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Settings,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { ProbeResult } from "./types";

interface ProbeCardProps {
  probeResult: ProbeResult;
  onConnect: (endpoint: FaktsEndpoint) => void;
  onRemove?: (baseUrl: string) => void;
  className?: string;
}

export const ProbeCard = ({
  probeResult,
  onConnect,
  onRemove,
  className = "",
}: ProbeCardProps) => {
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

  const canRemove = probeResult.probe.source === "stored" && onRemove;

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isDisabled ? "opacity-50" : "cursor-pointer"
      } ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {getStatusIcon()}
            <CardTitle className="text-lg font-semibold">
              {probeResult.probe.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {canRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(probeResult.probe.base_url);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Endpoint
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardDescription>{probeResult.probe.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground font-mono">
          {probeResult.probe.base_url}
        </p>
        {probeResult.error && (
          <p className="text-xs text-red-500 mt-2">Error: {probeResult.error}</p>
        )}
      </CardContent>
    </Card>
  );
};
