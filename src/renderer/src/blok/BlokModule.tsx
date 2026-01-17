import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/app/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import { Dashboards } from "./pages/Dashboards";
import { Home } from "./pages/Home";
import StandardPane from "./panes/StandardPane";
interface Props { }
/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC<Props> = () => {
  return (
    <Guard.Rekuest fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="dashboards" element={<Dashboards />} />
          <Route path="externalblock" element={<div>External Block</div>} />
        </Routes>
      </ModuleLayout>
    </Guard.Rekuest>
  );
};

export default Module;
