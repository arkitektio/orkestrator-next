import { EasyProvider, AutoConfiguration } from "@jhnnsrs/arkitekt";
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
import {
  GraphQLPostman,
  RekuestGuard,
  useWidgetRegistry,
  withRekuest,
} from "@jhnnsrs/rekuest";
import { useToast } from "./components/ui/use-toast";
import {
  PostmanAssignationFragment,
  useReturnNodeQuery,
} from "./rekuest/api/graphql";
import { ReturnsContainer } from "./components/widgets/returns/ReturnsContainer";
import { notEmpty } from "./lib/utils";

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

function App() {
  const { toast } = useToast();

  return (
    <EasyProvider
      manifest={{
        version: "latest",
        identifier: "github.io.jhnnsrs.orkestrator",
      }}
    >
      <Toaster />
      <ShadnWigets />
      <AutoConfiguration
        endpoints={["100.91.169.37:8000"]}
        rekuestPossibleTypes={rekuestFragments.possibleTypes}
        mikroPossibleTypes={mikroFragments.possibleTypes}
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
              <div className="bg-background">
                <div className="grid lg:grid-cols-5">
                  <RekuestGuard>
                    <Sidebar className="hidden lg:block" />
                  </RekuestGuard>

                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      <Routes>
                        <Route path="/" element={<Home />} />
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
      </ThemeProvider>
    </EasyProvider>
  );
}

export default App;
