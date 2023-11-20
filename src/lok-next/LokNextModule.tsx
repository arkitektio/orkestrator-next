import React from "react";
import { Route, Routes } from "react-router";
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
          <Route path="*" element={<> NOTHING</>} />
        </Routes>
      </ModuleLayout>
    </LokNextGuard>
  );
};

export default LokNextModule;
