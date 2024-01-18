import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { PortGuard } from "@jhnnsrs/port-next";
import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
interface Props {}

export const PortNextModule: React.FC<Props> = (props) => {
  return (
    <PortGuard fallback={<>Loading</>}>
      <ModuleLayout>
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </ModuleLayout>
    </PortGuard>
  );
};

export default PortNextModule;
