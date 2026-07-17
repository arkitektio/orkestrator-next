import { Guard } from "@/app/Arkitekt";
import { NotFound } from "@/app/components/fallbacks/NotFound";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Route, Routes } from "react-router";
import ADatasetPage from "./pages/ADatasetPage";
import ADatasetSpecPage from "./pages/ADatasetSpecPage";
import ADatasetsPage from "./pages/ADatasetsPage";
import CoordinateSystemPage from "./pages/CoordinateSystemPage";
import CoordinateSystemsPage from "./pages/CoordinateSystemsPage";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import InstanceMaskViewLabelPage from "./pages/InstanceMaskViewLabelPage";
import LightpathViewPage from "./pages/LightpathViewPage";
import PeerHomePage from "./pages/PeerHomePage";
import RoiPage from "./pages/RoiPage";
import RoisPage from "./pages/RoisPage";
import StagePage from "./pages/StagePage";
import StagesPage from "./pages/StagesPage";
import TablePage from "./pages/TablePage";
import TablesPage from "./pages/TablesPage";
import TableDatasetPage from "./pages/TableDatasetPage";
import TableDatasetsPage from "./pages/TableDatasetsPage";
import ScenesPage from "./pages/ScenesPage";
import ScenePage from "./pages/ScenePage";
import StandardPane from "./panes/StandardPane";

export const MikroNextModule = () => {
  return (
    <Guard.Mikro unavailable={<>Loading</>} unconfigured={<>Loading</>} configuring={<>Loading</>} challenging={<>Loading</>}>
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
          {/* Three segments, so it cannot be mistaken for adatasets/:id. */}
          <Route path="adatasets/spec/:spec" element={<ADatasetSpecPage />} />
          <Route path="adatasets/:id" element={<ADatasetPage />} />
          <Route path="adatasets" element={<ADatasetsPage />} />
          <Route
            path="coordinatesystems/:id"
            element={<CoordinateSystemPage />}
          />
          <Route path="coordinatesystems" element={<CoordinateSystemsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="rois" element={<RoisPage />} />
          <Route path="scenes" element={<ScenesPage />} />
          <Route path="scenes/:id" element={<ScenePage />} />
          <Route path="peerhome/:id" element={<PeerHomePage />} />
          <Route path="rois/:id" element={<RoiPage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/:id" element={<TablePage />} />
          <Route path="tabledatasets" element={<TableDatasetsPage />} />
          <Route path="tabledatasets/:id" element={<TableDatasetPage />} />
          <Route path="stages/:id" element={<StagePage />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default MikroNextModule;
