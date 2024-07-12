import { Arkitekt, Guard } from "@/arkitekt";
import { CommandMenu } from "@/command/Menu";
import { Toaster } from "@/components/ui/sonner";
import { ShadnWigets } from "@/components/widgets/ShadnWigets";
import { WELL_KNOWN_ENDPOINTS } from "@/constants";
import { WellKnownDiscovery } from "@/lib/fakts";
import { SystemMessageDisplay } from "@/lok-next/SystemMessage";
import { MikroNextWard } from "@/mikro-next/MikroNextWard";
import ImageDisplay from "@/mikro-next/displays/ImageDisplay";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CommandProvider } from "@/providers/command/CommandProvider";
import { DebugProvider } from "@/providers/debug/DebugProvider";
import { DisplayProvider } from "@/providers/display/DisplayProvider";
import { SelectionProvider } from "@/providers/selection/SelectionProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { FlussWard } from "@/reaktion/FlussWard";
import { RekuestNextWard } from "@/rekuest/RekuestNextWard";
import NodeDisplay from "@/rekuest/components/displays/NodeDisplay";
import { AssignationUpdater } from "@/rekuest/components/functional/AssignationUpdater";
import { ReservationUpdater } from "@/rekuest/components/functional/ReservationUpdater";
import { WidgetRegistryProvider } from "@/rekuest/widgets/WidgetsProvider";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { BrowserRouter, useNavigate } from "react-router-dom";

const displayRegistry = {
  "@mikro-next/image": ImageDisplay,
  "@rekuest/node": NodeDisplay,
};

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Go back again</button>
    </div>
  );
}

export const BackNavigationErrorCatcher = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => {
        console.log("Resetting error boundary");
        navigate(-1);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// The AppProvider is the root component of the application.
// It is responsible for providing all the context providers that are used in the application.
// It wraps the Easy Provider, which allows for the configuration of an Easy App through Arkitekt,
// Additionally, it wraps the DisplayProvider, which allows for the configuration of the display registry.
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DebugProvider>
      <BrowserRouter>
        <BackNavigationErrorCatcher>
          <Arkitekt.Provider>
            <DisplayProvider registry={displayRegistry}>
              <WellKnownDiscovery
                endpoints={WELL_KNOWN_ENDPOINTS} // this configures fakts to use the well known endpoints in order to discover the other services
              />
              <SelectionProvider>
                <CommandProvider>
                  <SmartProvider>
                    <WidgetRegistryProvider>
                      <Toaster />
                      <CommandMenu />
                      <Guard.Rekuest fallback={<></>}>
                        {/* Here we registed both the GraphQL Postman that will take care of assignments, and reserverations */}
                        <AssignationUpdater />
                        <ReservationUpdater />
                        {/* We register the Shadn powered widgets to the widget registry. */}
                        <RekuestNextWard />
                        <ShadnWigets />
                      </Guard.Rekuest>
                      <Guard.Mikro fallback={<></>}>
                        <MikroNextWard key="mikro" />
                      </Guard.Mikro>
                      <Guard.Fluss fallback={<></>}>
                        <FlussWard key="fluss" />
                      </Guard.Fluss>
                      <ThemeProvider
                        defaultTheme="dark"
                        storageKey="vite-ui-theme"
                      >
                        {/* This is where we configure the application automatically based on facts */}
                        {children}
                      </ThemeProvider>
                    </WidgetRegistryProvider>
                    <Guard.Lok fallback={<></>}>
                      <SystemMessageDisplay />
                    </Guard.Lok>
                  </SmartProvider>
                </CommandProvider>
              </SelectionProvider>
            </DisplayProvider>
          </Arkitekt.Provider>
        </BackNavigationErrorCatcher>
      </BrowserRouter>
    </DebugProvider>
  );
};
