import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import EntitiesPage from "./pages/EntitiesPage";
import EntityGraphPage from "./pages/EntityGraphPage";
import ExperimentPage from "./pages/ExperimentPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import OntologiesPage from "./pages/OntologiesPage";
import KnowledgePage from "./pages/OntologyPage";
import PlotterPage from "./pages/PlotterPage";
import ProtocolPage from "./pages/ProtocolPage";
import ProtocolStepPage from "./pages/ProtocolStepPage";
import ProtocolStepsPage from "./pages/ProtocolStepsPage";
import RenderedPlotPage from "./pages/RenderedPlotPage";
import RenderedPlotsPage from "./pages/RenderedPlotsPage";
import RenderTreePage from "./pages/RenderTreePage";
import RenderTreesPage from "./pages/RenderTreesPage";
import StagePage from "./pages/StagePage";
import StagesPage from "./pages/StagesPage";
import TablesPage from "./pages/TablesPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const MikroNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="images/:id" element={<ImagePage />} />
          <Route path="images" element={<ImagesPage />} />
          <Route path="datasets/:id" element={<DatasetPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="entities" element={<EntitiesPage />} />
          <Route path="entities/:id" element={<EntityGraphPage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="experiments/:id" element={<ExperimentPage />} />
          <Route path="ontologies/:id" element={<KnowledgePage />} />
          <Route path="ontologies" element={<OntologiesPage />} />
          <Route path="protocols/:id" element={<ProtocolPage />} />
          <Route path="protocolsteps/:id" element={<ProtocolStepPage />} />
          <Route path="protocolsteps" element={<ProtocolStepsPage />} />
          <Route path="stages/:id" element={<StagePage />} />
          <Route path="plotters/:id" element={<PlotterPage />} />
          <Route path="rendertrees/:id" element={<RenderTreePage />} />
          <Route path="rendertrees" element={<RenderTreesPage />} />
          <Route path="renderedplots/:id" element={<RenderedPlotPage />} />
          <Route path="renderedplots" element={<RenderedPlotsPage />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default MikroNextModule;
