import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import StandardPane from "./panes/StandardPane";
import ServicesPage from "./pages/ServicesPage";
import ServicePage from "./pages/ServicePage";
import ServiceInstancePage from "./pages/ServiceInstancePage";
import InstancesPage from "./pages/InstancesPage";
interface Props {}

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="users/:id" element={<UserPage />} />
          <Route path="clients/:id" element={<ClientPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="instances" element={<InstancesPage />} />
          <Route path="services/:id" element={<ServicePage />} />
          <Route
            path="serviceinstances/:id"
            element={<ServiceInstancePage />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lok>
  );
};

export default LokNextModule;
