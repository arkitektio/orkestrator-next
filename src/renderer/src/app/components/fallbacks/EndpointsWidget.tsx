import { Arkitekt } from "@/app/Arkitekt";
import { Button } from "@/components/ui/button";
import { DEFAULT_COORDINATION_SERVER_HOST, DEFAULT_COORDINATION_SERVER_URL } from "@/constants";
import { discover } from "@/lib/arkitekt/fakts/discover";
import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";

export const EndpointsWidget = () => {
  const connect = Arkitekt.useConnect();
  const autoLoginError = Arkitekt.useAutoLoginError();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionError, setConnectionError] = React.useState<string | null>(null);

  const handleConnect = async () => {
    const controller = new AbortController();

    try {
      setIsConnecting(true);
      setConnectionError(null);

      const endpoint = await discover({
        url: DEFAULT_COORDINATION_SERVER_URL,
        controller,
        timeout: 2000,
      });

      await connect({
        endpoint,
        controller,
      });
    } catch (error) {
      console.error("Connection failed:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Unable to connect to the coordination server.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-lg">
      {autoLoginError && (
        <div className="flex items-center justify-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{autoLoginError}</span>
        </div>
      )}

      {connectionError && (
        <div className="flex items-center justify-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{connectionError}</span>
        </div>
      )}

      <Button
        onClick={handleConnect}
        variant="outline"
        size="lg"
        disabled={isConnecting}
        className="w-full justify-center text-center h-auto py-3"
      >
        {isConnecting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{DEFAULT_COORDINATION_SERVER_HOST}</div>
            <div className="text-xs opacity-80 truncate">
              Connect to the default Arkitekt coordination server
            </div>
          </div>
        )}
      </Button>
    </div>
  );
};
