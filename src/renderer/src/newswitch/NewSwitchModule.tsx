import { Guard } from "@/app/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StreamPage from "./pages/StreamPage";
import StandardPane from "./panes/StandardPane";
import { NotFound } from "@/app/components/fallbacks/NotFound";
interface Props { }

export const Module: React.FC<Props> = (_props) => {
  return (
    <Guard.Mikro unavailable={<>Loading</>} unconfigured={<>Loading</>} configuring={<>Loading</>} challenging={<>Loading</>}>
      <Guard.Rekuest unavailable={<>Loading</>} unconfigured={<>Loading</>} configuring={<>Loading</>} challenging={<>Loading</>} key={"rekuest"}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route path="streams/:id" element={<StreamPage />} />
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
      </Guard.Rekuest>
    </Guard.Mikro>
  );
};

export default Module;
