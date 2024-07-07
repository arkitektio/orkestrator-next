import { Arkitekt } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import BackendPage from "./pages/BackendPage";
import HomePage from "./pages/HomePage";
import PodPage from "./pages/PodPage";
import PodsPage from "./pages/PodsPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const KabinetModule: React.FC<Props> = (props) => {
  return (
    <Arkitekt.KabinetGuard fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="pods" element={<PodsPage />} />
          <Route path="pods/:id" element={<PodPage/>} />
          <Route path="backends/:id" element={<BackendPage/>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Arkitekt.KabinetGuard>
  );
};

export default KabinetModule;
