import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import AppPage from "./pages/AppPage";
import AppsPage from "./pages/AppsPage";
import ClientPage from "./pages/ClientPage";
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
import ComputeNodePage from "./pages/ComputeNodePage";
import ComputeNodesPage from "./pages/ComputeNodesPage";
import StandardPane from "./panes/StandardPane";
import RedeemTokensPage from "./pages/RedeemTokensPage";
import RedeemTokenPage from "./pages/RedeemTokenPage";
import RecordPage from "./pages/RecordPage";
import OrganizationPage from "./pages/OrganizationPage";
import OrganizationsPage from "./pages/OrganizationsPage";
interface Props { }

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="me" element={<MePage />} />
          <Route path="record" element={<RecordPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="computenodes/:id" element={<ComputeNodePage />} />
          <Route path="computenodes" element={<ComputeNodesPage />} />
          <Route path="apps/:id" element={<AppPage />} />
          <Route path="releases/:id" element={<ReleasePage />} />
          <Route path="clients/:id" element={<ClientPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="instances" element={<InstancesPage />} />
          <Route path="organizations" element={<GroupsPage />} />
          <Route path="layers" element={<LayersPage />} />
          <Route path="layers/:id" element={<LayerPage />} />
          <Route path="organizations/:id" element={<OrganizationPage />} />
          <Route path="organizations" element={<OrganizationsPage />} />

          <Route path="services/:id" element={<ServicePage />} />
          <Route path="redeemtokens" element={<RedeemTokensPage />} />
          <Route path="redeemtokens/:id" element={<RedeemTokenPage />} />
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
