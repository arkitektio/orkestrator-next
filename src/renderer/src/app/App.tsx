import { Arkitekt } from "@/app/Arkitekt";
import Hero from "@/app/pages/Hero";
import { AppLayout } from "@/components/layout/AppLayout";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppProvider, BackNavigationErrorCatcher } from "./AppProvider";
import { ConnectingFallback } from "./components/fallbacks/Connecting";
import { NotConnected } from "./components/fallbacks/NotConnected";
import { NotFound } from "./components/fallbacks/NotFound";
import {PrivateNavigationBar} from "./components/navigation/PrivateNavigationBar";


const AlpakaModule = React.lazy(() => import("@/alpaka/AlpakaModule"));
const BlokModule = React.lazy(() => import("@/blok/BlokModule"));
const DokumentsModule = React.lazy(() => import("@/dokuments/DokumentsModule"));
const ElektroModule = React.lazy(() => import("@/elektro/ElektroModule"));
const KabinetModule = React.lazy(() => import("@/kabinet/KabinetModule"));
const KraphModule = React.lazy(() => import("@/kraph/KraphModule"));
const LokNextModule = React.lazy(() => import("@/lok-next/LokNextModule"));
const LovekitModule = React.lazy(() => import("@/lovekit/LovekitModule"));
const MikroNextModule = React.lazy(() => import("@/mikro-next/MikroNextModule"));
const OmeroArkModule = React.lazy(() => import("@/omero-ark/OmeroArkModule"));
const ReaktionModule = React.lazy(() => import("@/reaktion/ReaktionModule"));
const RekuestNextModule = React.lazy(() => import("@/rekuest/RekuestNextModule"));
const SettingsModule = React.lazy(() => import("@/settings/SettingsModule"));

const Stash = React.lazy(() =>
  import("@/lok-next/components/stash/Stash").then((module) => ({
    default: module.Stash,
  })),
);
// Entrypoint of the application.
// We provide two main routers, one for the public routes, and one for the private routes.
const protectModule = (component: React.ReactNode, fallback?: React.ReactNode) => {
  return (
    <Arkitekt.Guard
      notConnectedFallback={fallback || <NotConnected />}
      connectingFallback={<ConnectingFallback />}
    >
      {component}
    </Arkitekt.Guard>
  );
};

export const Fallback = () => {
  return <div> Puh this doesnt exist really</div>;
};

const ModuleFallback = () => <ConnectingFallback />;

const withModuleBoundary = (component: React.ReactNode) => {
  return <React.Suspense fallback={<ModuleFallback />}>{component}</React.Suspense>;
};

function App() {
  return (
    <AppProvider>
      <AppLayout navigationBar={withModuleBoundary(<PrivateNavigationBar />)}>
        <BackNavigationErrorCatcher>
          <Routes>
            <Route index element={<Hero />} />
            <Route path="mikro/*" element={protectModule(withModuleBoundary(<MikroNextModule />))} />
            <Route path="elektro/*" element={protectModule(withModuleBoundary(<ElektroModule />))} />
            <Route path="rekuest/*" element={protectModule(withModuleBoundary(<RekuestNextModule />))} />
            <Route path="fluss/*" element={protectModule(withModuleBoundary(<ReaktionModule />))} />
            <Route path="kabinet/*" element={protectModule(withModuleBoundary(<KabinetModule />))} />
            <Route path="omero_ark/*" element={protectModule(withModuleBoundary(<OmeroArkModule />))} />
            <Route path="kraph/*" element={protectModule(withModuleBoundary(<KraphModule />))} />
            <Route path="lok/*" element={protectModule(withModuleBoundary(<LokNextModule />))} />
            <Route path="settings/*" element={protectModule(withModuleBoundary(<SettingsModule />))} />
            <Route path="blok/*" element={protectModule(withModuleBoundary(<BlokModule />))} />
            <Route path="alpaka/*" element={protectModule(withModuleBoundary(<AlpakaModule />))} />
            <Route path="lovekit/*" element={protectModule(withModuleBoundary(<LovekitModule />))} />
            <Route path="dokuments/*" element={protectModule(withModuleBoundary(<DokumentsModule />))} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <React.Suspense fallback={null}>
            <Stash />
          </React.Suspense>
        </BackNavigationErrorCatcher>
      </AppLayout>
    </AppProvider>
  );
}

export default App;
