import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import { ConnectedGuard } from "./ConnectedGuard";
import DatasetPage from "./pages/DatasetPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ProjectPage from "./pages/ProjectPage";
interface Props {}

export const OmeroArkModule: React.FC<Props> = (props) => {
  return (
    <Guard.OmeroArk fallback={<>Loading</>}>
      <ModuleLayout>
        <ConnectedGuard>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="projects/:id" element={<ProjectPage />} />
            <Route path="datasets/:id" element={<DatasetPage />} />
            <Route path="images/:id" element={<ImagePage />} />
            <Route path="*" element={<> NOTHING</>} />
          </Routes>
        </ConnectedGuard>
      </ModuleLayout>
    </Guard.OmeroArk>
  );
};

export default OmeroArkModule;
