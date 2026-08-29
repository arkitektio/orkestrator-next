import { Guard } from "@/app/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router-dom";
import DocumentPage from "./pages/DocumentPage";
import FilePage from "./pages/FilePage";
import HomePage from "./pages/HomePage";
import PagePage from "./pages/PagePage";
import StandardPane from "./panes/StandardPane";
import { NotFound } from "@/app/components/fallbacks/NotFound";
interface Props { }

export const Module: React.FC<Props> = (_props) => {
  return (
    <Guard.Lovekit unavailable={<>Loading</>} unconfigured={<>Loading</>} configuring={<>Loading</>} challenging={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="files/:id" element={<FilePage />} />
          <Route path="pages/:id" element={<PagePage />} />
          <Route path="documents/:id" element={<DocumentPage />} />
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lovekit>
  );
};

export default Module;
