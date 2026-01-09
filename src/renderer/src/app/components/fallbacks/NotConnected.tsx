import { ArkitektLogo } from "@/app/components/logos/ArkitektLogo";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { CustomEndpointSheet } from "./CustomEndpointSheet";
import { EndpointsWidget } from "./EndpointsWidget";

export const NotConnected = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col w-full h-full bg-radial-[at_100%_100%] from-background to-backgroundpaired items-center justify-center px-4">
      <div className="flex flex-col items-center max-w-md space-y-6">
        {/* Logo */}
        <ArkitektLogo
          width={120}
          height={120}
          strokeColor="currentColor"
          cubeColor="var(--primary)"
          aColor="currentColor"
        />

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Arkitekt</h1>
          <p className="text-sm text-muted-foreground">
            Login with a coordination server to get started.
          </p>
        </div>

        {/* Endpoints Widget */}
        <EndpointsWidget />

        {/* Advanced Section */}
        <Collapsible
          open={showHelp}
          onOpenChange={setShowHelp}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              <ChevronDown
                className={`h-4 w-4 mr-2 transition-transform ${
                  showHelp ? "rotate-180" : ""
                }`}
              />
              More Options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="flex flex-col items-center gap-3">
              <CustomEndpointSheet />
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs"
              >
                <a
                  href="https://arkitekt.live/docs/introduction/basics"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  What is Arkitekt?
                </a>
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
