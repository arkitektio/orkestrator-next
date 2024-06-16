import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { LokNextGuard } from "@jhnnsrs/lok-next";
import React from "react";
import { Route, Routes } from "react-router";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <LokNextGuard fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="users/:id" element={<UserPage />} />
          <Route path="clients/:id" element={<ClientPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </LokNextGuard>
  );
};

export default LokNextModule;
