import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import ExpressionPage from "./pages/ExpressionPage";
import GraphPage from "./pages/GraphPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import LinkedExpressionPage from "./pages/LinkedExpressionPage";
import OntologiesPage from "./pages/OntologiesPage";
import KnowledgePage from "./pages/OntologyPage";
import ProtocolPage from "./pages/ProtocolPage";
import ProtocolStepPage from "./pages/ProtocolStepPage";
import ProtocolStepsPage from "./pages/ProtocolStepsPage";
import ProtocolStepTemplatePage from "./pages/ProtocolStepTemplatePage";
import ProtocolStepTemplatesPage from "./pages/ProtocolStepTemplatesPage";
import ReagentPage from "./pages/ReagentPage";
import ReagentsPage from "./pages/ReagentsPage";
import StandardPane from "./panes/StandardPane";
interface Props {}

export const KraphModule: React.FC<Props> = (props) => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="expressions/:id" element={<ExpressionPage />} />
          <Route path="ontologies/:id" element={<KnowledgePage />} />
          <Route path="ontologies" element={<OntologiesPage />} />
          <Route path="graphs" element={<GraphsPage />} />
          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="graphs/:id/view/:viewid" element={<GraphPage />} />
          <Route path="reagents" element={<ReagentsPage />} />
          <Route path="reagents/:id" element={<ReagentPage />} />
          <Route path="protocols/:id" element={<ProtocolPage />} />
          <Route path="protocolsteps/:id" element={<ProtocolStepPage />} />
          <Route
            path="protocolsteptemplates"
            element={<ProtocolStepTemplatesPage />}
          />
          <Route
            path="protocolsteptemplates/:id"
            element={<ProtocolStepTemplatePage />}
          />
          <Route path="protocolsteps" element={<ProtocolStepsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default KraphModule;
