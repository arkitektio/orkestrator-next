import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/app/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import CollectionPage from "./pages/CollectionPage";
import CollectionsPage from "./pages/CollectionsPage";
import HomePage from "./pages/HomePage";
import LLMModelPage from "./pages/LLMModelPage";
import LLMModelsPage from "./pages/LLMModelsPage";
import ProviderPage from "./pages/ProviderPage";
import ProvidersPage from "./pages/ProvidersPage";
import RoomPage from "./pages/RoomPage";
import RoomsPage from "./pages/RoomsPage";
import StandardPane from "./panes/StandardPane";
interface Props { }

export const AlpakaModule: React.FC<Props> = (props) => {
  return (
    <Guard.Alpaka fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="rooms/:id" element={<RoomPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="providers/:id" element={<ProviderPage />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="collections/:id" element={<CollectionPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="llmmodels/:id" element={<LLMModelPage />} />
          <Route path="llmmodels" element={<LLMModelsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Alpaka>
  );
};

export default AlpakaModule;
