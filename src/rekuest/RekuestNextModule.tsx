import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import Action from "./pages/Action";
import Actions from "./pages/Actions";
import Agent from "./pages/Agent";
import Assignation from "./pages/Assignation";
import Blok from "./pages/Blok";
import Bloks from "./pages/Bloks";
import Dashboard from "./pages/Dashboard";
import Dashboards from "./pages/Dashboards";
import Dependency from "./pages/Dependency";
import Home from "./pages/Home";
import Implementation from "./pages/Implementation";
import MemoryShelve from "./pages/MemoryShelve";
import Reservation from "./pages/Reservation";
import Reservations from "./pages/Reservations";
import Shortcut from "./pages/Shortcut";
import Shortcuts from "./pages/Shortcuts";
import Toolbox from "./pages/Toolbox";
import Toolboxes from "./pages/Toolboxes";
import Standardpane from "./panes/StandardPane";

interface Props { }
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
          <Route path="actions/:id" element={<Action />} />
          <Route path="reservations/:id" element={<Reservation />} />
          <Route path="shortcuts/:id" element={<Shortcut />} />
          <Route path="shortcuts" element={<Shortcuts />} />
          <Route path="toolboxes" element={<Toolboxes />} />
          <Route path="toolboxes/:id" element={<Toolbox />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="actions" element={<Actions />} />
          <Route path="dashboards" element={<Dashboards />} />
          <Route path="dashboards/:id" element={<Dashboard />} />
          <Route path="memoryshelves/:id" element={<MemoryShelve />} />
          <Route path="bloks/:id" element={<Blok />} />
          <Route path="bloks" element={<Bloks />} />
          <Route path="dependencies/:id" element={<Dependency />} />
          <Route path="implementations/:id" element={<Implementation />} />
          <Route path="agents/:id" element={<Agent />} />
          <Route path="assignations/:id" element={<Assignation />} />
        </Routes>
      </ModuleLayout>
    </Guard.Rekuest>
  );
};

export default Module;
