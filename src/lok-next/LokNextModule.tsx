import { Guard } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import UserPage from "./pages/UserPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="users/:id" element={<UserPage />} />
          <Route path="clients/:id" element={<ClientPage />} />
          <Route path="rooms/:id" element={<RoomPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lok>
  );
};

export default LokNextModule;
