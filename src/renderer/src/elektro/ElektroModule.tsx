import { Guard } from "@/app/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import AnalogSignalChannelPage from "./pages/AnalogSignalChannelPage";
import AnalogSignalPage from "./pages/AnalogSignalPage";
import BlockPage from "./pages/BlockPage";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import ExperimentPage from "./pages/ExperimentPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ModelCollectionPage from "./pages/ModelCollectionPage";
import ModelCollectionsPage from "./pages/ModelCollectionsPage";
import ModelWorkspacePage from "./pages/ModelWorkspacePage";
import ModelWorkspacesPage from "./pages/ModelWorkspacesPage";
import NeuronModelEditorPage from "./pages/NeuronModelEditorPage";
import NeuronModelPage from "./pages/NeuronModelPage";
import NeuronModelsPage from "./pages/NeuronModelsPage";
import RecordingPage from "./pages/RecordingPage";
import SimulationPage from "./pages/SimulationPage";
import SimulationsPage from "./pages/SimulationsPage";
import StimulusPage from "./pages/StimulusPage";
import TracePage from "./pages/TracePage";
import TracesPage from "./pages/TracesPage";
import StandardPane from "./panes/StandardPane";
import { MechanismPage } from "./pages/MechanismPage";
import { EnvironmentPage } from "./pages/EnvironmentPage";
import { ElektroZarrStoreProvider } from "./components/store/ElektroZarrStoreProvider";
interface Props { }

export const ElektroModule: React.FC<Props> = (props) => {
  return (
    <Guard.Elektro fallback={<>Loading</>}>
      <ElektroZarrStoreProvider>
        <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="traces/:id" element={<TracePage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="datasets/:id" element={<DatasetPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
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
          <Route path="neuronmodels/:id/edit" element={<NeuronModelEditorPage />} />
          <Route
            path="modelcollections/:id"
            element={<ModelCollectionPage />}
          />
          <Route
            path="modelworkspaces/:id"
            element={<ModelWorkspacePage />}
          />
          <Route path="modelworkspaces" element={<ModelWorkspacesPage />} />
          <Route path="traces" element={<TracesPage />} />
          <Route path="simulations" element={<SimulationsPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="neuronmodels" element={<NeuronModelsPage />} />
          <Route path="mechanisms/:id" element={<MechanismPage />} />
          <Route path="environments/:id" element={<EnvironmentPage />} />
          <Route path="modelcollections" element={<ModelCollectionsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        </ModuleLayout>
      </ElektroZarrStoreProvider>
    </Guard.Elektro>
  );
};

export default ElektroModule;
