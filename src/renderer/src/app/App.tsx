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


import AlpakaModule from "@/alpaka/AlpakaModule";
import BlokModule from "@/blok/BlokModule";
import DokumentsModule from "@/dokuments/DokumentsModule";
import ElektroModule from "@/elektro/ElektroModule";
import KabinetModule from "@/kabinet/KabinetModule";
import KraphModule from "@/kraph/KraphModule";
import LokNextModule from "@/lok-next/LokNextModule";
import LovekitModule from "@/lovekit/LovekitModule";
import MikroNextModule from "@/mikro-next/MikroNextModule";
import OmeroArkModule from "@/omero-ark/OmeroArkModule";
import ReaktionModule from "@/reaktion/ReaktionModule";
import RekuestNextModule from "@/rekuest/RekuestNextModule";
import SettingsModule from "@/settings/SettingsModule";
import { Stash } from "@/lok-next/components/stash/Stash";

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

function App() {
  return (
    <AppProvider>
      <AppLayout navigationBar={<PrivateNavigationBar />}>
        <BackNavigationErrorCatcher>
          <Routes>
            <Route index element={<Hero />} />
            <Route path="mikro/*" element={protectModule(<MikroNextModule />)} />
            <Route path="elektro/*" element={protectModule(<ElektroModule />)} />
            <Route path="rekuest/*" element={protectModule(<RekuestNextModule />)} />
            <Route path="fluss/*" element={protectModule(<ReaktionModule />)} />
            <Route path="kabinet/*" element={protectModule(<KabinetModule />)} />
            <Route path="omero_ark/*" element={protectModule(<OmeroArkModule />)} />
            <Route path="kraph/*" element={protectModule(<KraphModule />)} />
            <Route path="lok/*" element={protectModule(<LokNextModule />)} />
            <Route path="settings/*" element={protectModule(<SettingsModule />)} />
            <Route path="blok/*" element={protectModule(<BlokModule />)} />
            <Route path="alpaka/*" element={protectModule(<AlpakaModule />)} />
            <Route path="lovekit/*" element={protectModule(<LovekitModule />)} />
            <Route path="dokuments/*" element={protectModule(<DokumentsModule />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Stash />
        </BackNavigationErrorCatcher>
      </AppLayout>
    </AppProvider>
  );
}

export default App;
