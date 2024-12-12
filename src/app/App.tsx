import Hero from "@/app/pages/Hero";
import { Arkitekt } from "@/arkitekt/Arkitekt";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import KabinetModule from "@/kabinet/KabinetModule";
import { Callback } from "@/lib/herre";
import LokNextModule from "@/lok-next/LokNextModule";
import { Stash } from "@/lok-next/components/stash/Stash";
import MikroNextModule from "@/mikro-next/MikroNextModule";
import OmeroArkModule from "@/omero-ark/OmeroArkModule";
import ReaktionModule from "@/reaktion/ReaktionModule";
import RekuestNextModule from "@/rekuest/RekuestNextModule";
import SettingsModule from "@/settings/SettingsModule";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppProvider, BackNavigationErrorCatcher } from "./AppProvider";
import { NotConnected } from "./components/fallbacks/NotConnected";
import { NotFound } from "./components/fallbacks/NotFound";
import { NotLoggedIn } from "./components/fallbacks/NotLoggedIn";
import { PrivateNavigationBar } from "./components/navigation/PrivateNavigationBar";
import KraphModule from "@/kraph/KraphModule";
import BlokModule from "@/blok/BlokModule";
// Entrypoint of the application.
// We provide two main routers, one for the public routes, and one for the private routes.
export const protect = (component: React.ReactNode) => {
  return (
    <Arkitekt.Guard
      notLoggedInFallback={<NotLoggedIn />}
      notConnectedFallback={<NotConnected />}
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
      <TooltipProvider>
        <AppLayout navigationBar={<PrivateNavigationBar />}>
          <BackNavigationErrorCatcher>
            <Toaster />
            <Routes>
              <Route path="callback" element={<Callback />} />{" "}
              {/* This is the callback route for the herre provider, and needs to be publicalyl available. (Represents Oauth2 Callback)*/}
              <Route index element={<Hero />} />
              <Route path="mikro/*" element={protect(<MikroNextModule />)} />
              <Route
                path="rekuest/*"
                element={protect(<RekuestNextModule />)}
              />
              <Route path="fluss/*" element={protect(<ReaktionModule />)} />
              <Route path="kabinet/*" element={protect(<KabinetModule />)} />
              <Route path="omero-ark/*" element={protect(<OmeroArkModule />)} />
              <Route path="kraph/*" element={protect(<KraphModule />)} />
              <Route path="lok/*" element={protect(<LokNextModule />)} />
              <Route path="settings/*" element={protect(<SettingsModule />)} />
              <Route path="blok/*" element={protect(<BlokModule />)} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Stash />
          </BackNavigationErrorCatcher>
        </AppLayout>
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
