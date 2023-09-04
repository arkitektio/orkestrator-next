import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import React from "react";
import { Route, Routes } from "react-router";
import Flow from "./pages/Flow";
import Workspace from "./pages/Workspace";
import Home from "./pages/Home";

interface Props {}

const Module: React.FC<Props> = (props) => {
  return (
    <RekuestGuard fallback={<>Loading</>}>
      <ModuleLayout pane={<></>}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="workspaces/:id" element={<Workspace />} />
          <Route path="flows/:id" element={<Flow />} />
        </Routes>
      </ModuleLayout>
    </RekuestGuard>
  );
};

export default Module;
