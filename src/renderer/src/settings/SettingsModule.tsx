import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { NotFound } from "@/app/components/fallbacks/NotFound";


interface Props { }

export const SettingsModule: React.FC<Props> = () => {
  return (
    <ModuleLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ModuleLayout>
  );
};

export default SettingsModule;
