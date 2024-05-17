import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import React from "react";
import { Route, Routes } from "react-router";
import Node from "./pages/Node";
import Reservation from "./pages/Reservation";
import Home from "./pages/Home";
import Standardpane from "./panes/StandardPane";
import Template from "./pages/Template";
import Dependency from "./pages/Dependency";
import Provision from "./pages/Provision";
import Assignation from "./pages/Assignation";
import Agent from "./pages/Agent";

interface Props {}
/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC<Props> = (props) => {
  return (
    <RekuestGuard fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<Standardpane />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="nodes/:id" element={<Node />} />
          <Route path="reservations/:id" element={<Reservation />} />
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
