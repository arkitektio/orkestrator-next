import { CommandMenu } from "@/command/Menu";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShadnWigets } from "@/components/widgets/ShadnWigets";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { RequesterProvider } from "@/providers/requester/RequesterProvider";
import { ReserverProvider } from "@/providers/reserver/ReserverProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { EasyProvider } from "@jhnnsrs/arkitekt";
import { MikroNextProvider } from "@jhnnsrs/mikro-next";
import { LokNextProvider } from "@jhnnsrs/lok-next";
import {
  GraphQLPostman,
  PostmanProvider,
  RekuestGuard,
  RekuestProvider,
  WidgetRegistryProvider,
} from "@jhnnsrs/rekuest-next";
import { BrowserRouter } from "react-router-dom";
import { AppConfiguration } from "./AppConfiguration";
import { manifest } from "@/constants";
import { ReserveResolver } from "@/rekuest/components/global/ReserverResolver";
import { CommandProvider } from "@/providers/command/CommandProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EasyProvider manifest={manifest}>
      <CommandProvider>
        <SmartProvider>
          <RekuestProvider>
            <MikroNextProvider>
              <LokNextProvider>
                <WidgetRegistryProvider>
                  <CommandMenu />
                  <PostmanProvider>
                    <RekuestGuard fallback={<></>}>
                      <GraphQLPostman instanceId="main" />
                      <ShadnWigets />
                    </RekuestGuard>
                    <ThemeProvider
                      defaultTheme="dark"
                      storageKey="vite-ui-theme"
                    >
                      <RequesterProvider>
                        <ReserverProvider>
                          <ReserveResolver />
                          <TooltipProvider>
                            <Toaster />
                            <AppConfiguration />
                            <BrowserRouter>{children}</BrowserRouter>
                          </TooltipProvider>
                        </ReserverProvider>
                      </RequesterProvider>
                    </ThemeProvider>
                  </PostmanProvider>
                </WidgetRegistryProvider>
              </LokNextProvider>
            </MikroNextProvider>
          </RekuestProvider>
        </SmartProvider>
      </CommandProvider>
    </EasyProvider>
  );
};
