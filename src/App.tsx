import {
  EasyProvider,
  AutoConfiguration,
  useApp,
  EasyGuard,
  LogoutButton,
  UnconnectButton,
} from "@jhnnsrs/arkitekt";
import "./index.css";
import Home from "./pages/Home";
import Node from "./pages/Node";
import Reservation from "./pages/Reservation";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Menu } from "./components/navigation/Menu";
import { Sidebar } from "./components/navigation/Sidebar";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Callback } from "./components/Callback";
import { ShadnWigets } from "./components/widgets/ShadnWigets";
import { Toaster } from "./components/ui/toaster";
import rekuestFragments from "./rekuest/api/fragments";
import mikroFragments from "./rekuest/api/fragments";
import flussFragments from "./reaktion/api/fragments";
import {
  GraphQLPostman,
  RekuestGuard,
  useWidgetRegistry,
  withRekuest,
} from "@jhnnsrs/rekuest";
import { FlussGuard, withFluss } from "@jhnnsrs/fluss";
import { useToast } from "./components/ui/use-toast";
import {
  PostmanAssignationFragment,
  useReturnNodeQuery,
} from "./rekuest/api/graphql";
import { ReturnsContainer } from "./components/widgets/returns/ReturnsContainer";
import { notEmpty } from "./lib/utils";
import { useFlowQuery } from "./reaktion/api/graphql";
import { EditFlow } from "./reaktion/edit/EditFlow";
import { TooltipProvider } from "./components/ui/tooltip";

export const AssignContainer = (props: {
  assignation: PostmanAssignationFragment;
  returns: any[];
}) => {
  const { registry } = useWidgetRegistry();
  const { data } = withRekuest(useReturnNodeQuery)({
    variables: {
      assignation: props.assignation.id,
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

export const Flow = () => {
  const { data } = withFluss(useFlowQuery)({
    variables: {
      id: "389",
    },
  });

  return <> {data?.flow && <EditFlow flow={data.flow} />}</>;
};

export const Test = () => {
  const { manifest } = useApp();

  return (
    <EasyGuard>
      <FlussGuard fallback="Not yed with lust">
        <Flow />
      </FlussGuard>
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
      <AutoConfiguration
        wellKnownEndpoints={["100.91.169.37:8000"]}
        rekuest={{ possibleTypes: rekuestFragments.possibleTypes }}
        mikro={{ possibleTypes: mikroFragments.possibleTypes }}
        fluss={{ possibleTypes: flussFragments.possibleTypes }}
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
                  {a.status}{" "}
                  {a.returns && (
                    <RekuestGuard fallback={"NOOOO Request?"}>
                      <AssignContainer assignation={a} returns={a.returns} />
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
            <div className="md:hidden">
              <img
                src="/examples/music-light.png"
                width={1280}
                height={1114}
                alt="Music"
                className="block dark:hidden"
              />
              <img
                src="/examples/music-dark.png"
                width={1280}
                height={1114}
                alt="Music"
                className="hidden dark:block"
              />
            </div>
            <div className="hidden md:block">
              <Menu />
              <div className="border-t">
                <div className="h-full bg-background">
                  <div className="grid lg:grid-cols-5">
                    <RekuestGuard>
                      <Sidebar className="hidden lg:block" />
                    </RekuestGuard>

                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                      <div className="h-full px-4 py-6 lg:px-8">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/fluss" element={<Test />} />
                          <Route path="/nodes/:id" element={<Node />} />
                          <Route
                            path="/reservations/:id"
                            element={<Reservation />}
                          />
                          <Route path="/callback" element={<Callback />} />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </EasyProvider>
  );
}

export default App;
