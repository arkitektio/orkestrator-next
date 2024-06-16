import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { MikroNextGuard } from "@jhnnsrs/mikro-next";
import React from "react";
import { Route, Routes } from "react-router";
import DatasetPage from "./pages/DatasetPage";
import DatasetsPage from "./pages/DatasetsPage";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import ImagesPage from "./pages/ImagesPage";
import RenderTreePage from "./pages/RenderTreePage";
import RenderTreesPage from "./pages/RenderTreesPage";
import StagePage from "./pages/StagePage";
import StagesPage from "./pages/StagesPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const MikroNextModule: React.FC<Props> = (props) => {
  return (
    <MikroNextGuard fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="images/:id" element={<ImagePage />} />
          <Route path="images" element={<ImagesPage />} />
          <Route path="datasets/:id" element={<DatasetPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="stages/:id" element={<StagePage />} />
          <Route path="rendertrees/:id" element={<RenderTreePage />} />
          <Route path="rendertrees" element={<RenderTreesPage />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="*" element={<> NOTHING</>} />
        </Routes>
      </ModuleLayout>
    </MikroNextGuard>
  );
};

export default MikroNextModule;
