import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import Action from "./pages/Action";
import Actions from "./pages/Actions";
import AgentPage from "./pages/AgentPage";
import Assignation from "./pages/Assignation";
import Blok from "./pages/Blok";
import Bloks from "./pages/Bloks";
import Dashboard from "./pages/Dashboard";
import Dashboards from "./pages/Dashboards";
import Dependency from "./pages/Dependency";
import AgentsPage from "./pages/AgentsPage";
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
import StructurePackages from "./pages/StructurePackages";
import StructurePackage from "./pages/StructurePackage";
import StructurePage from "./pages/StructurePage";
import InterfacePage from "./pages/InterfacePage";
import InterfacesPage from "./pages/InterfacesPage";
import StructuresPage from "./pages/StructuresPage";
import AssignationLogPage from "./pages/assignation/AssignationLogPage";
import AssignationsPage from "./pages/AssignationsPage";
import ImplementationsPage from "./pages/ImplementationsPage";

/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC = () => {
  return (
    <Guard.Rekuest fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<Standardpane />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="actions/:id" element={<Action />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="reservations/:id" element={<Reservation />} />
          <Route path="shortcuts/:id" element={<Shortcut />} />
          <Route path="shortcuts" element={<Shortcuts />} />
          <Route path="toolboxes" element={<Toolboxes />} />
          <Route path="toolboxes/:id" element={<Toolbox />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="actions" element={<Actions />} />
          <Route path="dashboards" element={<Dashboards />} />
          <Route path="dashboards/:id" element={<Dashboard />} />
          <Route path="structurepackages" element={<StructurePackages />} />
          <Route path="structurepackages/:id" element={<StructurePackage />} />

          <Route path="structures/:id" element={<StructurePage />} />
          <Route path="structures" element={<StructuresPage />} />
          <Route path="interfaces/:id" element={<InterfacePage />} />
          <Route path="interfaces" element={<InterfacesPage />} />
          <Route path="memoryshelves/:id" element={<MemoryShelve />} />
          <Route path="bloks/:id" element={<Blok />} />
          <Route path="bloks" element={<Bloks />} />
          <Route path="dependencies/:id" element={<Dependency />} />
          <Route path="implementations" element={<ImplementationsPage />} />
          <Route path="implementations/:id" element={<Implementation />} />
          <Route path="agents/:id" element={<AgentPage />} />
          <Route path="assignations" element={<AssignationsPage />} />
          <Route path="assignations/:id" element={<Assignation />} />
          <Route path="assignations/:id/log" element={<AssignationLogPage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Rekuest>
  );
};

export default Module;
