import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import EntitiesPage from "./pages/EntitiesPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
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
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="stages/:id" element={<StagePage />} />
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
