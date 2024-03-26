import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import React from "react";
import { Route, Routes } from "react-router";
import Node from "./pages/Node";
import Reservation from "./pages/Reservation";
import Home from "./pages/Home";

interface Props {}
/**
 *
 * The Rekuest Module is the entrypoint to all specfic rekuest functionality.
 * It provides the routes for the rekuest module.
 */
const Module: React.FC<Props> = (props) => {
  return (
    <RekuestGuard fallback={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<></>}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="nodes/:id" element={<Node />} />
          <Route path="reservations/:id" element={<Reservation />} />
        </Routes>
      </ModuleLayout>
    </RekuestGuard>
  );
};

export default Module;
