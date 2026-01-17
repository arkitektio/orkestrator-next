import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/app/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import { ConnectedGuard } from "./ConnectedGuard";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import ProjectsPage from "./pages/ProjectsPage";
import HomePage from "./pages/HomePage";
import OmeroImagePage from "./pages/OmeroImagePage";
import ProjectPage from "./pages/ProjectPage";
import StandardPane from "./panes/StandardPane";


export const OmeroArkModule = () => {
  return (
    <Guard.OmeroArk fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <ConnectedGuard>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="projects/:id" element={<ProjectPage />} />
            <Route path="datasets/:id" element={<DatasetPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="datasets" element={<DatasetsPage />} />
            <Route path="images/:id" element={<OmeroImagePage />} />
            <Route path="*" element={<> NOTHING</>} />
          </Routes>
        </ConnectedGuard>
      </ModuleLayout>
    </Guard.OmeroArk>
  );
};

export default OmeroArkModule;
