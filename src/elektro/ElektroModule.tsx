import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const ElektroModule: React.FC<Props> = (props) => {
  return (
    <Guard.Elektro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="rooms/:id" element={<RoomPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Elektro>
  );
};

export default ElektroModule;
