import { Arkitekt, Guard } from "@/app/Arkitekt";
import "@/app/configureSmartBuilder";
import { DialogProvider } from "@/app/dialog";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { baseName, Router } from "@/constants";
import { useFatalReport } from "@/hooks/use-report";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CommandProvider } from "@/providers/command/CommandProvider";
import { DebugProvider } from "@/providers/debug/DebugProvider";
import { SelectionProvider } from "@/providers/selection/SelectionProvider";
import { SettingsProvider } from "@/providers/settings/SettingsProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { AssignationUpdater } from "@/rekuest/components/functional/AssignationUpdater";
import { WidgetRegistryProvider } from "@/rekuest/widgets/WidgetsProvider";
import { NuqsAdapter } from "nuqs/adapters/react-router"; // <--- Specific adapter
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { DisplayProvider } from "./display";
import { THE_WIDGET_REGISTRY } from "./shadCnWidgetRegistry";


function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  const reportBug = useFatalReport();

  return (
    <ModuleLayout pane={<div className="flex items-center justify-center h-full w-full"><div className="text-6xl text-muted-foreground mb-3">😬</div></div>}>
      <PageLayout title="Test">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="text-6xl text-muted-foreground mb-3">😬</div>
          <div className="text-2xl font-bold mb-5">
            Oh boy this is embarrassing
          </div>

          <p>Something went wrong:</p>
          <pre style={{ color: "red" }} className="my-5">
            {error.message}
          </pre>

          <p className="text-muted-foreground mb-2">
            You can try to go back and try again. But please let us know about
            this...
          </p>
          <ButtonGroup>
            <Button variant={"outline"} onClick={resetErrorBoundary}>
              Go back again
            </Button>
            <Button className="ml-2"
              variant={"destructive"}
              onClick={() => reportBug(error)}
            >
              Report Bug
            </Button>
          </ButtonGroup>
        </div>
      </PageLayout>
    </ModuleLayout>
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

        navigate(-1);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

import { UploadProvider } from "@/providers/upload/UploadProvider";
import { DownloadProvider } from "@/providers/download/DownloadProvider";

// The AppProvider is the root component of the application.
// It is responsible for providing all the context providers that are used in the application.
// It wraps the Easy Provider, which allows for the configuration of an Easy App through Arkitekt,
// Additionally, it wraps the DisplayProvider, which allows for the configuration of the display registry.
import { AgentProvider } from "./agent/AgentProvider";
import { WardRegistrar } from "@/lib/arkitekt/WardRegistrar";
import { BuiltinDashboardWidgets } from "@/providers/dashboard/widgets/BuiltinDashboardWidgets";
import { RekuestDashboardWidgets } from "@/providers/dashboard/widgets/RekuestDashboardWidgets";
import { MikroDashboardWidgets } from "@/providers/dashboard/widgets/MikroDashboardWidgets";


const AgentUpdater = React.lazy(() =>
  import("@/rekuest/components/functional/AgentUpdater").then((module) => ({
    default: module.AgentUpdater,
  })),
);

const LazyProviderBoundary = ({ children }: { children: React.ReactNode }) => {
  return <React.Suspense fallback={null}>{children}</React.Suspense>;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsProvider>
      <UploadProvider>
        <DownloadProvider>
          <CommandProvider>
            <DebugProvider>
              <Router basename={baseName}>
                <NuqsAdapter>
                  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  {/* This is where we configure the application automatically based on facts */}

                  <Arkitekt.Provider>
                    <TooltipProvider>
                      <DisplayProvider>
                        <WidgetRegistryProvider registry={THE_WIDGET_REGISTRY}>
                          <SmartProvider>
                            <DialogProvider>
                              <SelectionProvider>
                                <AgentProvider disabled={true}>
                                  <WardRegistrar />
                                  <BuiltinDashboardWidgets />
                                  <Guard.Rekuest fallback={<></>}>
                                    <LazyProviderBoundary>
                                      <AssignationUpdater />
                                      <AgentUpdater />
                                    </LazyProviderBoundary>
                                    <RekuestDashboardWidgets />
                                    <Toaster />
                                  </Guard.Rekuest>
                                  <Guard.Mikro fallback={<></>}>
                                    <MikroDashboardWidgets />
                                  </Guard.Mikro>
                                  <BackNavigationErrorCatcher>
                                    {children}
                                  </BackNavigationErrorCatcher>
                                </AgentProvider>
                              </SelectionProvider>
                            </DialogProvider>
                          </SmartProvider>
                        </WidgetRegistryProvider>
                      </DisplayProvider>
                    </TooltipProvider>
                  </Arkitekt.Provider>
                </ThemeProvider>
              </NuqsAdapter>
            </Router>
          </DebugProvider>
        </CommandProvider>
      </DownloadProvider>
    </UploadProvider>
  </SettingsProvider>
  );
};
