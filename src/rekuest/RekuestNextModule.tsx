import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import Agent from "./pages/Agent";
import Assignation from "./pages/Assignation";
import Dashboard from "./pages/Dashboard";
import Dashboards from "./pages/Dashboards";
import Dependency from "./pages/Dependency";
import Home from "./pages/Home";
import Node from "./pages/Node";
import Nodes from "./pages/Nodes";
import Panel from "./pages/Panel";
import Panels from "./pages/Panels";
import Reservation from "./pages/Reservation";
import Reservations from "./pages/Reservations";
import Template from "./pages/Template";
import Standardpane from "./panes/StandardPane";
import Interfaces from "./pages/Interfaces";
import Interface from "./pages/Interface";
import Shortcut from "./pages/Shortcut";
import Shortcuts from "./pages/Shortcuts";
import Toolboxes from "./pages/Toolboxes";
import Toolbox from "./pages/Toolbox";

interface Props {}
/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC<Props> = () => {
  return (
    <Guard.Rekuest fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<Standardpane />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="nodes/:id" element={<Node />} />
          <Route path="reservations/:id" element={<Reservation />} />
          <Route path="shortcuts/:id" element={<Shortcut />} />
          <Route path="shortcuts" element={<Shortcuts />} />
          <Route path="toolboxes" element={<Toolboxes />} />
          <Route path="toolboxes/:id" element={<Toolbox />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="dashboards" element={<Dashboards />} />
          <Route path="dashboards/:id" element={<Dashboard />} />
          <Route path="panels/:id" element={<Panel />} />
          <Route path="panels" element={<Panels />} />
          <Route path="interfaces" element={<Interfaces />} />
          <Route path="dependencies/:id" element={<Dependency />} />
          <Route path="templates/:id" element={<Template />} />
          <Route path="agents/:id" element={<Agent />} />
          <Route path="assignations/:id" element={<Assignation />} />
          <Route path="interfaces/:kind/:id" element={<Interface />} />
        </Routes>
      </ModuleLayout>
    </Guard.Rekuest>
  );
};

export default Module;
