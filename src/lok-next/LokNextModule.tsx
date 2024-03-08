import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import { MikroNextGuard } from "@jhnnsrs/mikro-next";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { LokNextGuard } from "@jhnnsrs/lok-next";
interface Props {}

export const LokNextModule: React.FC<Props> = (props) => {
  return (
    <LokNextGuard fallback={<>Loading</>}>
      <ModuleLayout>
        <Routes>
          <Route path="users/:id" element={<UserPage />} />
          <Route path="*" element={<HomePage/>} />
        </Routes>
      </ModuleLayout>
    </LokNextGuard>
  );
};

export default LokNextModule;
