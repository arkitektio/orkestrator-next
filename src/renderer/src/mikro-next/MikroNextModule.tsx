import { NotFound } from "@/app/components/fallbacks/NotFound";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/app/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import LightpathViewPage from "./pages/LightpathViewPage";
import MeshPage from "./pages/MeshPage";
import MeshesPage from "./pages/MeshesPage";
import RoiPage from "./pages/RoiPage";
import RoisPage from "./pages/RoisPage";
import StagePage from "./pages/StagePage";
import StagesPage from "./pages/StagesPage";
import TablePage from "./pages/TablePage";
import TablesPage from "./pages/TablesPage";
import StandardPane from "./panes/StandardPane";
import InstanceMaskViewLabelPage from "./pages/InstanceMaskViewLabelPage";
import PeerHomePage from "./pages/PeerHomePage";

export const MikroNextModule: React.FC<Props> = (props) => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="images/:id" element={<ImagePage />} />
          <Route path="lightpathviews/:id" element={<LightpathViewPage />} />
          <Route
            path="instancemaskviewlabels/:id"
            element={<InstanceMaskViewLabelPage />}
          />
          <Route path="images" element={<ImagesPage />} />
          <Route path="datasets/:id" element={<DatasetPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="rois" element={<RoisPage />} />
          <Route path="peerhome/:id" element={<PeerHomePage />} />
          <Route path="rois/:id" element={<RoiPage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/:id" element={<TablePage />} />
          <Route path="meshes/:id" element={<MeshPage />} />
          <Route path="meshes" element={<MeshesPage />} />
          <Route path="stages/:id" element={<StagePage />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default MikroNextModule;
