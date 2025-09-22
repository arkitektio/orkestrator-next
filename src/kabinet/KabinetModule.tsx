import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import BackendPage from "./pages/BackendPage";
import DefinitionPage from "./pages/DefinitionPage";
import FlavourPage from "./pages/FlavourPage";
import HomePage from "./pages/HomePage";
import PodPage from "./pages/PodPage";
import PodsPage from "./pages/PodsPage";
import ReleasePage from "./pages/ReleasePage";
import ResourcePage from "./pages/ResourcePage";
import StandardPane from "./panes/StandardPane";
interface Props { }

export const KabinetModule: React.FC<Props> = (props) => {
  return (
    <Guard.Kabinet fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="pods" element={<PodsPage />} />
          <Route path="pods/:id" element={<PodPage />} />
          <Route path="definitions/:id" element={<DefinitionPage />} />
          <Route path="resources/:id" element={<ResourcePage />} />
          <Route path="backends/:id" element={<BackendPage />} />
          <Route path="releases/:id" element={<ReleasePage />} />
          <Route path="flavours/:id" element={<FlavourPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Kabinet>
  );
};

export default KabinetModule;
