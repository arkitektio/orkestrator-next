import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import Flow from "./pages/Flow";
import Home from "./pages/Home";
import Run from "./pages/Run";
import Runs from "./pages/Runs";
import Workspace from "./pages/Workspace";
import Workspaces from "./pages/Workspaces";
import SearchPane from "./panes/SearchPane";

interface Props {}

/**
 * The Reaktion Module is the entrypoint to all stream workflow related functionality
 * It provides the routes for the reaktion module.
 *
 *
 * @returns
 */

const Module: React.FC<Props> = (props) => {
  return (
    <Guard.Fluss fallback={<>Loading</>}>
      <ModuleLayout
        pane={
          <>
            <SearchPane />
          </>
        }
      >
        <Routes>
          <Route index element={<Home />} />
          <Route path="runs" element={<Runs />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="workspaces/:id" element={<Workspace />} />
          <Route path="flows/:id" element={<Flow />} />
          <Route path="runs/:id" element={<Run />} />
        </Routes>
      </ModuleLayout>
    </Guard.Fluss>
  );
};

export default Module;
