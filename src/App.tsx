import {
  AutoConfiguration,
  Callback,
  EasyGuard,
  EasyProvider,
  LogoutButton,
  UnconnectButton,
  useApp,
} from "@jhnnsrs/arkitekt";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./index.css";
import Home from "./pages/Home";
import Node from "./pages/Node";
import Reservation from "./pages/Reservation";

import {
  GraphQLPostman,
  PostmanProvider,
  RekuestGuard,
  RekuestProvider,
  WidgetRegistryProvider,
  useWidgetRegistry,
  withRekuest,
} from "@jhnnsrs/rekuest-next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommandMenu } from "./command/Menu";
import { Menu } from "./components/navigation/Menu";
import { Sidebar } from "./components/navigation/Sidebar";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useToast } from "./components/ui/use-toast";
import { ShadnWigets } from "./components/widgets/ShadnWigets";
import { ReturnsContainer } from "./components/widgets/returns/ReturnsContainer";
import { RekuestNextAutoConfigure } from "./config/RekuestNextAutoConfigure";
import { notEmpty } from "./lib/utils";
import Flow from "./pages/Flow";
import Workspace from "./pages/Workspace";
import { ThemeProvider } from "./providers/ThemeProvider";
import mikroFragments from "./rekuest/api/fragments";
import {
  AssignationEventFragment,
  useReturnNodeQuery
} from "./rekuest/api/graphql";
import { SmartProvider } from "./smart/provider";

export const AssignContainer = (props: {
  event: AssignationEventFragment;
  returns: any[];
}) => {
  const { registry } = useWidgetRegistry();
  const { data } = withRekuest(useReturnNodeQuery)({
    variables: {
      assignation: props.event.assignation.id,
    },
  });

  if (!data?.node?.returns) return <>No node found</>;

  return (
    <>
      <ReturnsContainer
        values={props.returns}
        ports={data?.node.returns.filter(notEmpty)}
        registry={registry}
      />
    </>
  );
};

export const Test = () => {
  const { manifest } = useApp();

  return (
    <EasyGuard>
      <RekuestGuard fallback={"NOOOO Request?"}>
        <Flow />
      </RekuestGuard>
      hallo
      <LogoutButton />
      <UnconnectButton />
    </EasyGuard>
  );
};

function App() {
  const { toast } = useToast();

  return (
    <EasyProvider
      manifest={{
        version: "latest",
        identifier: "github.io.jhnnsrs.orkestrator",
      }}
    >
      <SmartProvider>
        <RekuestProvider>
          <WidgetRegistryProvider>
            <CommandMenu/>
            <PostmanProvider>
              <RekuestNextAutoConfigure />
              <AutoConfiguration
                wellKnownEndpoints={["100.91.169.37:8000"]}
                mikro={{ possibleTypes: mikroFragments.possibleTypes }}
              />
              <RekuestGuard>
                <GraphQLPostman
                  instanceId="main"
                  onAssignUpdate={(a) =>
                    toast({
                      title: "Assign Update",
                      description: (
                        <>
                          {" "}
                          {a.returns && (
                            <RekuestGuard fallback={"NOOOO Request?"}>
                              <AssignContainer event={a} returns={a.returns} />
                            </RekuestGuard>
                          )}
                        </>
                      ),
                    })
                  }
                />
              </RekuestGuard>
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <TooltipProvider>
                  <Toaster />
                  <ShadnWigets />
                  <BrowserRouter>
                    <div className="flex flex-col h-screen w-screen">
                      <Menu />
                      <div className="flex-grow border-t">
                        <div className="h-full bg-background">
                        <PanelGroup autoSaveId="persistence" direction="horizontal">
                            <Panel>
                              <RekuestGuard>
                                <Sidebar className="" />
                              </RekuestGuard>
                            </Panel>
                            <PanelResizeHandle className="h-full w-1 opacity-0 hover:opacity-80 bg-white" />

                            <Panel>
                              <div className="h-full ">
                                <Routes>
                                  <Route path="/" element={<Home />} />
                                  <Route path="/fluss" element={<Test />} />
                                  <Route path="/flows/:id" element={<Flow />} />
                                  <Route path="/nodes/:id" element={<Node />} />
                                  <Route
                                    path="/workspaces/:id"
                                    element={<Workspace />}
                                  />
                                  <Route
                                    path="/reservations/:id"
                                    element={<Reservation />}
                                  />
                                  <Route
                                    path="/callback"
                                    element={<Callback />}
                                  />
                                </Routes>
                              </div>
                              </Panel>
                        </PanelGroup>
                        </div>
                      </div>
                    </div>
                  </BrowserRouter>
                </TooltipProvider>
              </ThemeProvider>
            </PostmanProvider>
          </WidgetRegistryProvider>
        </RekuestProvider>
      </SmartProvider>
    </EasyProvider>
  );
}

export default App;
