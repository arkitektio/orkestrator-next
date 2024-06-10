import { Arkitekt } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
interface Props {}

export const KabinetModule: React.FC<Props> = (props) => {
  return (
    <Arkitekt.KabinetGuard fallback={<>Loading</>}>
      <ModuleLayout>
        <Routes>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Arkitekt.KabinetGuard>
  );
};

export default KabinetModule;
