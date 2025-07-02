import { Guard } from "@/lib/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import StandardPane from "./panes/StandardPane";
import StreamPage from "./pages/StreamPage";
interface Props {}

export const Module: React.FC<Props> = (props) => {
  return (
    <Guard.Lovekit fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="streams/:id" element={<StreamPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lovekit>
  );
};

export default Module;
