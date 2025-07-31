import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import StreamPage from "./pages/StreamPage";
import StandardPane from "./panes/StandardPane";
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
