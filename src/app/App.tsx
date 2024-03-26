import { Route, RouteProps, Routes } from "react-router-dom";
import { AppProvider } from "./AppProvider";
import PrivateRouter from "./routers/PrivateRouter";
import PublicRouter from "./routers/PublicRouter";
import { PrivateNavigationBar } from "./components/navigation/PrivateNavigationBar";
import { AppLayout } from "@/components/layout/AppLayout";
import Hero from "@/app/pages/Hero";
import MikroNextModule from "@/mikro-next/MikroNextModule";
import RekuestNextModule from "@/rekuest/RekuestNextModule";
import ReaktionModule from "@/reaktion/ReaktionModule";
import { Callback, EasyGuard, } from "@jhnnsrs/arkitekt";
import LokNextModule from "@/lok-next/LokNextModule";
import OmeroArkModule from "@/omero-ark/OmeroArkModule";
import SettingsModule from "@/settings/SettingsModule";
import PortNextModule from "@/port-next/PortNextModule";
import React from "react";
// Entrypoint of the application.
// We provide two main routers, one for the public routes, and one for the private routes.
export const protect = (component: React.ReactNode) => {
  return <EasyGuard>{component}</EasyGuard>;
};




function App() {
  return (
    <AppProvider>
      <AppLayout navigationBar={<PrivateNavigationBar />}>
        <Routes>
          <Route path="callback" element={<Callback />} />{" "}
          {/* This is the callback route for the herre provider, and needs to be publicalyl available. (Represents Oauth2 Callback)*/}
          <Route index element={<Hero />} />
          <Route path="mikronext/*" element={protect(<MikroNextModule />)} />
          <Route path="rekuest/*" element={protect(<RekuestNextModule />)} />
          <Route path="fluss/*" element={protect(<ReaktionModule />)} />
          <Route path="port-next/*" element={protect(<PortNextModule />)} />
          <Route path="omero-ark/*" element={protect(<OmeroArkModule />)} />
          <Route path="lok/*" element={protect(<LokNextModule />)} />
          <Route path="settings/*" element={protect(<SettingsModule />)} />
        </Routes>
    </AppLayout>
    </AppProvider>
  );
}

export default App;
