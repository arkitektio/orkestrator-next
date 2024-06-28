import { Arkitekt } from "@/arkitekt";
import { CommandMenu } from "@/command/Menu";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShadnWigets } from "@/components/widgets/ShadnWigets";
import { manifest } from "@/constants";
import { SystemMessageDisplay } from "@/lok-next/SystemMessage";
import { MikroNextWard } from "@/mikro-next/MikroNextWard";
import ImageDisplay from "@/mikro-next/displays/ImageDisplay";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CommandProvider } from "@/providers/command/CommandProvider";
import { DebugProvider } from "@/providers/debug/DebugProvider";
import { DisplayProvider } from "@/providers/display/DisplayProvider";
import { RequesterProvider } from "@/providers/requester/RequesterProvider";
import { ReserverProvider } from "@/providers/reserver/ReserverProvider";
import { SelectionProvider } from "@/providers/selection/SelectionProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { FlussWard } from "@/reaktion/FlussWard";
import NodeDisplay from "@/rekuest/components/displays/NodeDisplay";
import { AssignationUpdater } from "@/rekuest/components/functional/AssignationUpdater";
import { ReservationUpdater } from "@/rekuest/components/functional/ReservationUpdater";
import { ReserveResolver } from "@/rekuest/components/global/ReserverResolver";
import { WidgetRegistryProvider } from "@/rekuest/widgets/WidgetsProvider";
import { EasyProvider } from "@jhnnsrs/arkitekt";
import { FlussGuard, FlussProvider } from "@jhnnsrs/fluss-next";
import { LokNextGuard, LokNextProvider } from "@jhnnsrs/lok-next";
import { MikroNextGuard, MikroNextProvider } from "@jhnnsrs/mikro-next";
import { OmeroArkProvider } from "@jhnnsrs/omero-ark";
import { PortProvider } from "@jhnnsrs/port-next";
import {
  PostmanProvider,
  RekuestGuard,
  RekuestProvider,
} from "@jhnnsrs/rekuest-next";
import { BrowserRouter } from "react-router-dom";
import { AppConfiguration } from "./AppConfiguration";

const displayRegistry = {
  "@mikro-next/image": ImageDisplay,
  "@rekuest/node": NodeDisplay,
};

// The AppProvider is the root component of the application.
// It is responsible for providing all the context providers that are used in the application.
// It wraps the Easy Provider, which allows for the configuration of an Easy App through Arkitekt,
// Additionally, it wraps the DisplayProvider, which allows for the configuration of the display registry.
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DebugProvider>
      <EasyProvider manifest={manifest}>
        <Arkitekt.Provider manifest={manifest}>
          <DisplayProvider registry={displayRegistry}>
            <SelectionProvider>
              <CommandProvider>
                <SmartProvider>
                  <RekuestProvider>
                    <FlussProvider>
                      <PortProvider>
                        <MikroNextProvider>
                          <OmeroArkProvider>
                            <LokNextProvider>
                              <WidgetRegistryProvider>
                                <Toaster />
                                <CommandMenu />
                                <PostmanProvider>
                                  <RekuestGuard fallback={<></>}>
                                    {/* Here we registed both the GraphQL Postman that will take care of assignments, and reserverations */}
                                    <AssignationUpdater />
                                    <ReservationUpdater />
                                    {/* We register the Shadn powered widgets to the widget registry. */}
                                    <ShadnWigets />
                                  </RekuestGuard>
                                  <MikroNextGuard fallback={<></>}>
                                    <MikroNextWard key="mikro" />
                                  </MikroNextGuard>
                                  <FlussGuard fallback={<></>}>
                                    <FlussWard key="fluss" />
                                  </FlussGuard>
                                  <ThemeProvider
                                    defaultTheme="dark"
                                    storageKey="vite-ui-theme"
                                  >
                                    <RequesterProvider>
                                      <ReserverProvider>
                                        <ReserveResolver />
                                        <TooltipProvider>
                                          <Toaster />
                                          <AppConfiguration />{" "}
                                          {/* This is where we configure the application automatically based on facts */}
                                          <BrowserRouter>
                                            {children}
                                          </BrowserRouter>
                                        </TooltipProvider>
                                      </ReserverProvider>
                                    </RequesterProvider>
                                  </ThemeProvider>
                                </PostmanProvider>
                              </WidgetRegistryProvider>
                              <LokNextGuard fallback={<></>}>
                                <SystemMessageDisplay />
                              </LokNextGuard>
                            </LokNextProvider>
                          </OmeroArkProvider>
                        </MikroNextProvider>
                      </PortProvider>
                    </FlussProvider>
                  </RekuestProvider>
                </SmartProvider>
              </CommandProvider>
            </SelectionProvider>
          </DisplayProvider>
        </Arkitekt.Provider>
      </EasyProvider>
    </DebugProvider>
  );
};
