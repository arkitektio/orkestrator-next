import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import StandardPane from "./panes/StandardPane";
import LLMModelPage from "./pages/LLMModelPage";
import CollectionPage from "./pages/CollectionPage";
import ProviderPage from "./pages/ProviderPage";
interface Props {}

export const AlpakaModule: React.FC<Props> = (props) => {
  return (
    <Guard.Lok fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="rooms/:id" element={<RoomPage />} />
          <Route path="providers/:id" element={<ProviderPage />} />
          <Route path="collections/:id" element={<CollectionPage />} />
          <Route path="llmmodels/:id" element={<LLMModelPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Lok>
  );
};

export default AlpakaModule;
