import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import EntityGraphPage from "./pages/EntityGraphPage";
import ExperimentPage from "./pages/ExperimentPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import ExpressionPage from "./pages/ExpressionPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import GraphEntitiesPage from "./pages/GraphEntitiesPage";
import GraphPage from "./pages/GraphPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import LinkedExpressionPage from "./pages/LinkedExpressionPage";
import OntologiesPage from "./pages/OntologiesPage";
import KnowledgePage from "./pages/OntologyPage";
import PlotterPage from "./pages/PlotterPage";
import ProtocolPage from "./pages/ProtocolPage";
import ProtocolStepPage from "./pages/ProtocolStepPage";
import ProtocolStepsPage from "./pages/ProtocolStepsPage";
import ReagentPage from "./pages/ReagentPage";
import ReagentsPage from "./pages/ReagentsPage";
import RenderedPlotPage from "./pages/RenderedPlotPage";
import RenderedPlotsPage from "./pages/RenderedPlotsPage";
import RenderTreePage from "./pages/RenderTreePage";
import RenderTreesPage from "./pages/RenderTreesPage";
import RoiPage from "./pages/RoiPage";
import StagePage from "./pages/StagePage";
import StagesPage from "./pages/StagesPage";
import TablePage from "./pages/TablePage";
import TablesPage from "./pages/TablesPage";
import StandardPane from "./panes/StandardPane";
import EntityPage from "./pages/EntityPage";
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
          <Route path="rois/:id" element={<RoiPage />} />
          <Route path="entities/:id" element={<EntityPage />} />
          <Route path="entities/:id/graph" element={<EntityGraphPage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/:id" element={<TablePage />} />
          <Route path="expressions/:id" element={<ExpressionPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="experiments/:id" element={<ExperimentPage />} />
          <Route path="ontologies/:id" element={<KnowledgePage />} />
          <Route path="ontologies" element={<OntologiesPage />} />
          <Route path="graphs" element={<GraphsPage />} />

          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="reagents" element={<ReagentsPage />} />
          <Route path="reagents/:id" element={<ReagentPage />} />
          <Route path="graphs/:id/entities" element={<GraphEntitiesPage />} />
          <Route
            path="linkedexpressions/:id"
            element={<LinkedExpressionPage />}
          />
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
