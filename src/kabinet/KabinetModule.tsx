import { Arkitekt } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const KabinetModule: React.FC<Props> = (props) => {
  return (
    <Arkitekt.KabinetGuard fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Arkitekt.KabinetGuard>
  );
};

export default KabinetModule;
