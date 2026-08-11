import { Guard } from "@/app/Arkitekt";
import { NotFound } from "@/app/components/fallbacks/NotFound";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Route, Routes } from "react-router";
import ADatasetPage from "./pages/ADatasetPage";
import ADatasetSpecPage from "./pages/ADatasetSpecPage";
import ADatasetsPage from "./pages/ADatasetsPage";
import AnnotationPage from "./pages/AnnotationPage";
import AnnotationsPage from "./pages/AnnotationsPage";
import CoordinateSystemPage from "./pages/CoordinateSystemPage";
import CoordinateSystemsPage from "./pages/CoordinateSystemsPage";
import FilePage from "./pages/FilePage";
import FilesPage from "./pages/FilesPage";
import FolderPage from "./pages/FolderPage";
import FoldersPage from "./pages/FoldersPage";
import HomePage from "./pages/HomePage";
import PeerHomePage from "./pages/PeerHomePage";
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
          <Route path="folders/:id" element={<FolderPage />} />
          <Route path="folders" element={<FoldersPage />} />
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
          <Route path="annotations" element={<AnnotationsPage />} />
          <Route path="annotations/:id" element={<AnnotationPage />} />
          <Route path="scenes" element={<ScenesPage />} />
          <Route path="scenes/:id" element={<ScenePage />} />
          <Route path="peerhome/:id" element={<PeerHomePage />} />
          <Route path="files/:id" element={<FilePage />} />
          <Route path="tabledatasets" element={<TableDatasetsPage />} />
          <Route path="tabledatasets/:id" element={<TableDatasetPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default MikroNextModule;
