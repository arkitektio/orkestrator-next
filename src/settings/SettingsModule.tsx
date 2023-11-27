import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { OmeroArkGuard } from "@jhnnsrs/omero-ark";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
interface Props {}

export const SettingsModule: React.FC<Props> = (props) => {
  return (
      <ModuleLayout>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="*" element={<> NOTHING</>} />
        </Routes>
      </ModuleLayout>
  );
};

export default SettingsModule;
