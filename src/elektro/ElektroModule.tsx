import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import ExperimentPage from "./pages/ExperimentPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import HomePage from "./pages/HomePage";
import ModelCollectionPage from "./pages/ModelCollectionPage";
import ModelCollectionsPage from "./pages/ModelCollectionsPage";
import NeuronModelPage from "./pages/NeuronModelPage";
import NeuronModelsPage from "./pages/NeuronModelsPage";
import RecordingPage from "./pages/RecordingPage";
import SimulationPage from "./pages/SimulationPage";
import SimulationsPage from "./pages/SimulationsPage";
import StimulusPage from "./pages/StimulusPage";
import TracePage from "./pages/TracePage";
import TracesPage from "./pages/TracesPage";
import StandardPane from "./panes/StandardPane";
import AnalogSignalPage from "./pages/AnalogSignalPage";
import BlockPage from "./pages/BlockPage";
import AnalogSignalChannelPage from "./pages/AnalogSignalChannelPage";
interface Props { }

export const ElektroModule: React.FC<Props> = (props) => {
  return (
    <Guard.Elektro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="traces/:id" element={<TracePage />} />
          <Route path="simulations/:id" element={<SimulationPage />} />
          <Route path="experiments/:id" element={<ExperimentPage />} />
          <Route path="blocks/:id" element={<BlockPage />} />

          <Route path="analogsignals/:id" element={<AnalogSignalPage />} />
          <Route
            path="analogsignalchannels/:id"
            element={<AnalogSignalChannelPage />}
          />
          <Route path="recordings/:id" element={<RecordingPage />} />
          <Route path="stimuli/:id" element={<StimulusPage />} />
          <Route path="neuronmodels/:id" element={<NeuronModelPage />} />
          <Route
            path="modelcollections/:id"
            element={<ModelCollectionPage />}
          />
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
