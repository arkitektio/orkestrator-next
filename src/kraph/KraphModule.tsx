import { NotFound } from "@/app/components/fallbacks/NotFound";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import EntityCategoriesPage from "./pages/EntityCategoriesPage";
import EntityCategoryPage from "./pages/EntityCategoryPage";
import EntityPage from "./pages/EntityPage";
import GraphPage from "./pages/GraphPage";
import GraphQueryPage from "./pages/GraphQueryPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import MeasurementCategoriesPage from "./pages/MeasurementCategoriesPage";
import MeasurementCategoryPage from "./pages/MeasurementCategoryPage";
import MetricCategoriesPage from "./pages/MetricCategoriesPage";
import MetricCategoryPage from "./pages/MetricCategoryPage";
import NaturalEventCategoriesPage from "./pages/NaturalEventCategoriesPage";
import NaturalEventCategoryPage from "./pages/NaturalEventCategoryPage";
import NodePage from "./pages/NodePage";
import NodeQueryPage from "./pages/NodeQueryPage";
import NodeViewPage from "./pages/NodeViewPage";
import ProtocolEventCategoriesPage from "./pages/ProtocolEventCategoriesPage";
import ProtocolEventCategoryPage from "./pages/ProtocolEventCategoryPage";
import ProtocolEventPage from "./pages/ProtocolEventPage";
import ReagentCategoriesPage from "./pages/ReagentCategoriesPage";
import ReagentCategoryPage from "./pages/ReagentCategoryPage";
import ReagentPage from "./pages/ReagentPage";
import ReagentsPage from "./pages/ReagentsPage";
import RelationCategoriesPage from "./pages/RelationCategoriesPage";
import RelationCategoryPage from "./pages/RelationCategoryPage";
import StructureCategoriesPage from "./pages/StructureCategoriesPage";
import {
  default as ExpressionPage,
  default as StructureCategoryPage,
} from "./pages/StructureCategoryPage";
import StructurePage from "./pages/StructurePage";
import StructureRelationCategoriesPage from "./pages/StructureRelationCategoriesPage";
import StuctureRelationCategoryPage from "./pages/StructureRelationCategoryPage";
import StandardPane from "./panes/StandardPane";
import GraphReagentCategoriesPage from "./pages/graph/GraphReagentCategoriesPage";
import MetricPage from "./pages/MetricPage";
import RelationPage from "./pages/RelationPage";
import StructureRelationPage from "./pages/StructureRelationPage";
import GraphQueryDesignerPage from "./pages/designer/GraphQueryDesignerPage";
import NodeQueryDesignerPage from "./pages/designer/NodeQueryDesignerPage";
import BuilderPage from "./pages/graph/BuilderPage";
import GraphGraphQueriesPage from "./pages/graph/GraphGraphQueriesPage";
interface Props { }

export const KraphModule: React.FC<Props> = (props) => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route
            path="graphs/:id/reagentcategories"
            element={<GraphReagentCategoriesPage />}
          />
          <Route path="expressions/:id" element={<ExpressionPage />} />
          <Route path="nodes/:id" element={<NodePage />} />
          <Route path="relations/:id" element={<RelationPage />} />
          <Route
            path="structurerelations/:id"
            element={<StructureRelationPage />}
          />
          <Route path="entities/:id" element={<EntityPage />} />
          <Route path="metrics/:id" element={<MetricPage />} />
          <Route path="structures/:id" element={<StructurePage />} />
          <Route path="protocolevents/:id" element={<ProtocolEventPage />} />
          <Route path="graphs" element={<GraphsPage />} />
          <Route path="graphs/:id/builder" element={<BuilderPage />} />
          <Route path="graphs/:id/queries" element={<GraphGraphQueriesPage />} />
          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="graphqueries/:id" element={<GraphQueryPage />} />
          <Route
            path="nodequeries/:id/node/:node"
            element={<NodeQueryPage />}
          />
          <Route
            path="nodequeries/:id/node/:node/designer"
            element={<NodeQueryDesignerPage />}
          />
          <Route
            path="graphqueries/:id/designer"
            element={<GraphQueryDesignerPage />}
          />
          <Route path="nodequeries/:id" element={<NodeQueryPage />} />
          <Route
            path="nodequeries/:id/view/:nodeid"
            element={<NodeViewPage />}
          />

          <Route path="reagentcategories" element={<ReagentCategoriesPage />} />
          <Route path="entitycategories" element={<EntityCategoriesPage />} />
          <Route
            path="structurerelationcategories"
            element={<StructureRelationCategoriesPage />}
          />
          <Route
            path="structurerelationcategories/:id"
            element={<StuctureRelationCategoryPage />}
          />
          <Route
            path="structurecategories"
            element={<StructureCategoriesPage />}
          />
          <Route
            path="measurementcategories"
            element={<MeasurementCategoriesPage />}
          />
          <Route
            path="naturaleventcategories"
            element={<NaturalEventCategoriesPage />}
          />
          <Route
            path="relationcategories"
            element={<RelationCategoriesPage />}
          />
          <Route
            path="protocoleventcategories"
            element={<ProtocolEventCategoriesPage />}
          />
          <Route path="metriccategories" element={<MetricCategoriesPage />} />

          <Route
            path="structurecategories/:id"
            element={<StructureCategoryPage />}
          />
          <Route path="metriccategories/:id" element={<MetricCategoryPage />} />
          <Route
            path="relationcategories/:id"
            element={<RelationCategoryPage />}
          />

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
          <Route
            path="measurementcategories/:id"
            element={<MeasurementCategoryPage />}
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
