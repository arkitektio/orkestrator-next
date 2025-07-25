import { Guard } from "@/lib/arkitekt/Arkitekt";
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
import AppPage from "./pages/AppPage";
import ReleasePage from "./pages/ReleasePage";
import AppsPage from "./pages/AppsPage";
import GroupsPage from "./pages/GroupsPage";
import GroupPage from "./pages/GroupPage";
import UsersPage from "./pages/UsersPage";
import LayersPage from "./pages/LayersPage";
import LayerPage from "./pages/LayerPage";
interface Props {}

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="apps/:id" element={<AppPage />} />
          <Route path="releases/:id" element={<ReleasePage />} />
          <Route path="clients/:id" element={<ClientPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="instances" element={<InstancesPage />} />
          <Route path="organizations" element={<GroupsPage />} />
          <Route path="layers" element={<LayersPage />} />
          <Route path="layers/:id" element={<LayerPage />} />
          <Route path="groups/:id" element={<GroupPage />} />
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
