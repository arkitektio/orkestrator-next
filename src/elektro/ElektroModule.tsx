import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import TracePage from "./pages/TracePage";
import StandardPane from "./panes/StandardPane";
import SimulationPage from "./pages/SimulationPage";
import NeuronModelPage from "./pages/NeuronModelPage";
import ExperimentPage from "./pages/ExperimentPage";
import SimulationsPage from "./pages/SimulationsPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import NeuronModelsPage from "./pages/NeuronModelsPage";
import TracesPage from "./pages/TracesPage";
import ModelCollectionPage from "./pages/ModelCollectionPage";
import ModelCollectionsPage from "./pages/ModelCollectionsPage";
import RecordingPage from "./pages/RecordingPage";
import StimulusPage from "./pages/StimulusPage";
interface Props {}

export const ElektroModule: React.FC<Props> = (props) => {
  return (
    <Guard.Elektro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="traces/:id" element={<TracePage />} />
          <Route path="simulations/:id" element={<SimulationPage/>} />
          <Route path="experiments/:id" element={<ExperimentPage/>} />
          <Route path="recordings/:id" element={<RecordingPage />} />
          <Route path="stimulus/:id" element={<StimulusPage/>} />
          <Route path="neuronmodels/:id" element={<NeuronModelPage/>} />
          <Route path="modelcollections/:id" element={<ModelCollectionPage/>} />
          <Route path="traces" element={<TracesPage />} />
          <Route path="simulations" element={<SimulationsPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="neuronmodels" element={<NeuronModelsPage />} />
          <Route path="modelcollections" element={<ModelCollectionsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </Guard.Elektro>
  );
};

export default ElektroModule;
