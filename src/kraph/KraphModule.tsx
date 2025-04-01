import { NotFound } from "@/app/components/fallbacks/NotFound";
import { Guard } from "@/arkitekt/Arkitekt";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import React from "react";
import { Route, Routes } from "react-router";
import EntityCategoryPage from "./pages/EntityCategoryPage";
import GraphPage from "./pages/GraphPage";
import GraphQueryPage from "./pages/GraphQueryPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import NaturalEventCategoryPage from "./pages/NaturalEventCategoryPage";
import NodePage from "./pages/NodePage";
import ProtocolEventCategoryPage from "./pages/ProtocolEventCategoryPage";
import ReagentPage from "./pages/ReagentPage";
import ReagentsPage from "./pages/ReagentsPage";
import {
  default as ExpressionPage,
  default as StructureCategoryPage,
} from "./pages/StructureCategoryPage";
import StandardPane from "./panes/StandardPane";
import EntityPage from "./pages/EntityPage";
import ReagentCategoryPage from "./pages/ReagentCategoryPage";
import ReagentCategoriesPage from "./pages/ReagentCategoriesPage";
import EntityCategoriesPage from "./pages/EntityCategoriesPage";
import StructureCategoriesPage from "./pages/StructureCategoriesPage";
import ProtocolEventCategoriesPage from "./pages/ProtocolEventCategoriesPage";
import MetricCategoryPage from "./pages/MetricCategoryPage";
interface Props {}

export const KraphModule: React.FC<Props> = (props) => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="expressions/:id" element={<ExpressionPage />} />
          <Route path="nodes/:id" element={<NodePage />} />
          <Route path="entities/:id" element={<EntityPage />} />
          <Route path="graphs" element={<GraphsPage />} />
          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="graphqueries/:id" element={<GraphQueryPage />} />
          <Route path="reagentcategories" element={<ReagentCategoriesPage />} />
          <Route path="entitycategories" element={<EntityCategoriesPage />} />
          <Route
            path="structurecategories"
            element={<StructureCategoriesPage />}
          />
          <Route
            path="protocoleventcategories"
            element={<ProtocolEventCategoriesPage />}
          />

          <Route
            path="structurecategories/:id"
            element={<StructureCategoryPage />}
          />
          <Route path="metriccategories/:id" element={<MetricCategoryPage />} />

          <Route path="entitycategories/:id" element={<EntityCategoryPage />} />
          <Route
            path="protocoleventcategories/:id"
            element={<ProtocolEventCategoryPage />}
          />
          <Route
            path="naturaleventcategories/:id"
            element={<NaturalEventCategoryPage />}
          />
          <Route
            path="reagentcategories/:id"
            element={<ReagentCategoryPage />}
          />
          <Route path="graphs/:id/view/:viewid" element={<GraphPage />} />
          <Route path="reagents" element={<ReagentsPage />} />
          <Route path="reagents/:id" element={<ReagentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default KraphModule;
