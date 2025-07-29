import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import FilePage from "./pages/FilePage";
import HomePage from "./pages/HomePage";
import StandardPane from "./panes/StandardPane";
import PagePage from "./pages/PagePage";
import DocumentPage from "./pages/DocumentPage";
interface Props {}

export const Module: React.FC<Props> = (props) => {
  return (
    <Guard.Lovekit fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="files/:id" element={<FilePage />} />
          <Route path="pages/:id" element={<PagePage />} />
          <Route path="documents/:id" element={<DocumentPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lovekit>
  );
};

export default Module;
