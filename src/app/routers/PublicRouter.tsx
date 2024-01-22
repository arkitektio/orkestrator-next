import { AppLayout } from "@/components/layout/AppLayout";
import { PublicNavigationBar } from "@/app/components/navigation/PublicNavigationBar";
import { Callback } from "@jhnnsrs/arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import Hero from "@/app/pages/Hero";
interface Props {}

// Public Routes
// These routes are accessible by anyone, and do not require authentication.
export const PublicRouter: React.FC<Props> = (props) => {
  return (
    <AppLayout navigationBar={<PublicNavigationBar />}>
      <Routes>
        <Route path="callback" element={<Callback />} />{" "}
        {/* This is the callback route for the herre provider, and needs to be publicalyl available. (Represents Oauth2 Callback)*/}
        <Route index element={<Hero />} />
      </Routes>
    </AppLayout>
  );
};

export default PublicRouter;
