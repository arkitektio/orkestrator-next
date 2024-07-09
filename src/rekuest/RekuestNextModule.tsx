import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import React from "react";
import { Route, Routes } from "react-router";
import Agent from "./pages/Agent";
import Assignation from "./pages/Assignation";
import Dependency from "./pages/Dependency";
import Home from "./pages/Home";
import Node from "./pages/Node";
import Nodes from "./pages/Nodes";
import Provision from "./pages/Provision";
import Reservation from "./pages/Reservation";
import Reservations from "./pages/Reservations";
import Template from "./pages/Template";
import Standardpane from "./panes/StandardPane";

interface Props {}
/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC<Props> = () => {
  return (
    <RekuestGuard fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<Standardpane />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="nodes/:id" element={<Node />} />
          <Route path="reservations/:id" element={<Reservation />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="dependencies/:id" element={<Dependency />} />
          <Route path="templates/:id" element={<Template />} />
          <Route path="provisions/:id" element={<Provision />} />
          <Route path="agents/:id" element={<Agent />} />
          <Route path="assignations/:id" element={<Assignation />} />
        </Routes>
      </ModuleLayout>
    </RekuestGuard>
  );
};

export default Module;
