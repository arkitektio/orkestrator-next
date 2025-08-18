import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import AppPage from "./pages/AppPage";
import AppsPage from "./pages/AppsPage";
import ClientPage from "./pages/ClientPage";
import GroupPage from "./pages/GroupPage";
import GroupsPage from "./pages/GroupsPage";
import HomePage from "./pages/HomePage";
import InstancesPage from "./pages/InstancesPage";
import LayerPage from "./pages/LayerPage";
import LayersPage from "./pages/LayersPage";
import MePage from "./pages/MePage";
import ReleasePage from "./pages/ReleasePage";
import ServiceInstancePage from "./pages/ServiceInstancePage";
import ServicePage from "./pages/ServicePage";
import ServicesPage from "./pages/ServicesPage";
import UserPage from "./pages/UserPage";
import UsersPage from "./pages/UsersPage";
import StandardPane from "./panes/StandardPane";
interface Props { }

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="me" element={<MePage />} />
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
