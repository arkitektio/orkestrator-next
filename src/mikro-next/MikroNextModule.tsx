import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import RoisPage from "./pages/RoisPage";
import DatasetsPage from "./pages/DatasetsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import PixelViewPage from "./pages/PixelViewPage";
import PlotterPage from "./pages/PlotterPage";
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
import MeshPage from "./pages/MeshPage";
import MeshesPage from "./pages/MeshesPage";
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
          <Route path="rois" element={<RoisPage />} />

          <Route path="rois/:id" element={<RoiPage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/:id" element={<TablePage />} />
          <Route path="meshes/:id" element={<MeshPage />} />
          <Route path="meshes" element={<MeshesPage />} />
          <Route path="pixelviews/:id" element={<PixelViewPage />} />
          <Route
            path="pixelviews/:id/value/:value"
            element={<PixelViewPage />}
          />
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
