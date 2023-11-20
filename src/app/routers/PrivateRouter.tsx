import { AppLayout } from "@/components/layout/AppLayout";
import { PrivateNavigationBar } from "@/app/components/navigation/PrivateNavigationBar";
import React from "react";
import { Route, Routes } from "react-router";
import MikroNextModule from "@/mikro-next/MikroNextModule";
import RekuestNextModule from "@/rekuest/RekuestNextModule";
import ReaktionModule from "@/reaktion/ReaktionModule";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import LokNextModule from "@/lok-next/LokNextModule";
interface Props {}

export const PrivateRouter: React.FC<Props> = (props) => {
  return (
    <AppLayout navigationBar={<PrivateNavigationBar />}>
      <EasyGuard>
        <Routes>
          <Route path="mikronext/*" element={<MikroNextModule />} />
          <Route path="rekuest/*" element={<RekuestNextModule />} />
          <Route path="reaktion/*" element={<ReaktionModule />} />
          <Route path="lok/*" element={<LokNextModule />} />
        </Routes>
      </EasyGuard>
    </AppLayout>
  );
};

export default PrivateRouter;