import { CommandMenu } from "@/command/Menu";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShadnWigets } from "@/components/widgets/ShadnWigets";
import { RekuestNextAutoConfigure } from "@/config/RekuestNextAutoConfigure";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { EasyProvider } from "@jhnnsrs/arkitekt";
import { MikroNextProvider } from "@jhnnsrs/mikro-next";
import {
  GraphQLPostman,
  PostmanProvider,
  RekuestGuard,
  RekuestProvider,
  WidgetRegistryProvider,
} from "@jhnnsrs/rekuest-next";
import { BrowserRouter } from "react-router-dom";
import { AppConfiguration } from "./AppConfiguration";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EasyProvider
      manifest={{
        version: "latest",
        identifier: "github.io.jhnnsrs.orkestrator",
      }}
    >
      <SmartProvider>
        <RekuestProvider>
          <MikroNextProvider>
            <WidgetRegistryProvider>
              <CommandMenu />
              <PostmanProvider>
                <RekuestGuard fallback={<></>}>
                  <GraphQLPostman instanceId="main" />
                  <ShadnWigets />
                </RekuestGuard>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <TooltipProvider>
                    <Toaster />
                    <AppConfiguration />
                    <BrowserRouter>{children}</BrowserRouter>
                  </TooltipProvider>
                </ThemeProvider>
              </PostmanProvider>
            </WidgetRegistryProvider>
          </MikroNextProvider>
        </RekuestProvider>
      </SmartProvider>
    </EasyProvider>
  );
};
