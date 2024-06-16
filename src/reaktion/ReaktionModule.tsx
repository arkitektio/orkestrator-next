import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { FlussGuard } from "@jhnnsrs/fluss-next";
import React from "react";
import { Route, Routes } from "react-router";
import Flow from "./pages/Flow";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
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
    <FlussGuard fallback={<>Loading</>}>
      <ModuleLayout
        pane={
          <>
            <SearchPane />
          </>
        }
      >
        <Routes>
          <Route index element={<Home />} />
          <Route path="workspaces/:id" element={<Workspace />} />
          <Route path="flows/:id" element={<Flow />} />
        </Routes>
      </ModuleLayout>
    </FlussGuard>
  );
};

export default Module;
