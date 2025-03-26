import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import ExpressionPage from "./pages/StructureCategoryPage";
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
import NodePage from "./pages/NodePage";
import GraphViewPage from "./pages/GraphViewPage";
import NodeViewPage from "./pages/NodeViewPage";
import PlotViewPage from "./pages/PlotViewPage";
import GraphQueryPage from "./pages/GraphQueryPage";
import PlotViewsPage from "./pages/PlotViewsPage";
import StructureCategoryPage from "./pages/StructureCategoryPage";
import GenericCategoryPage from "./pages/GenericCategoryPage";
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
          <Route path="nodes/:id" element={<NodePage />} />
          <Route path="graphs" element={<GraphsPage />} />
          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="graphviews/:id" element={<GraphViewPage />} />
          <Route path="graphqueries/:id" element={<GraphQueryPage />} />
          <Route path="structurecategories/:id" element={<StructureCategoryPage />} />
          <Route path="genericcategories/:id" element={<GenericCategoryPage />} />
          <Route path="plotviews" element={<PlotViewsPage />} />
          <Route path="plotviews/:id" element={<PlotViewPage />} />
          <Route path="nodeviews/:id" element={<NodeViewPage />} />
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
