import { NotFound } from "@/app/components/fallbacks/NotFound";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { Guard } from "@/app/Arkitekt";
import React from "react";
import { Route, Routes } from "react-router";
import EntityCategoriesPage from "./pages/EntityCategoriesPage";
import EntityCategoryPage from "./pages/EntityCategoryPage";
import EntityPage from "./pages/EntityPage";
import GraphPage from "./pages/GraphPage";
import GraphQueryPage from "./pages/GraphTableQueryPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import MeasurementCategoriesPage from "./pages/MeasurementCategoriesPage";
import MeasurementCategoryPage from "./pages/MeasurementCategoryPage";
import MetricCategoriesPage from "./pages/MetricCategoriesPage";
import MetricCategoryPage from "./pages/MetricCategoryPage";
import NaturalEventCategoriesPage from "./pages/NaturalEventCategoriesPage";
import NaturalEventCategoryPage from "./pages/NaturalEventCategoryPage";
import NodePage from "./pages/NodePage";
import ProtocolEventCategoriesPage from "./pages/ProtocolEventCategoriesPage";
import ProtocolEventCategoryPage from "./pages/ProtocolEventCategoryPage";
import ProtocolEventPage from "./pages/ProtocolEventPage";
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
import MetricPage from "./pages/MetricPage";
import RelationPage from "./pages/RelationPage";
import StructureRelationPage from "./pages/StructureRelationPage";
import BuilderPage from "./pages/graph/BuilderPage";
import GraphGraphQueriesPage from "./pages/graph/GraphGraphQueriesPage";
import ScatterPlotPage from "./pages/ScatterPlotPage";

import { EntityCategorySchemaBuilderPage } from "./pages/EntityCategorySchemaBuilderPage";
interface Props { }

export const KraphModule: React.FC<Props> = () => {
  return (
    <Guard.Mikro fallback={<>Loading</>}>
      <ModuleLayout pane={<StandardPane />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="expressions/:id" element={<ExpressionPage />} />
          <Route path="nodes/:id" element={<NodePage />} />
          <Route path="relations/:id" element={<RelationPage />} />
          <Route
            path="structurerelations/:id"
            element={<StructureRelationPage />}
          />
          <Route path="entities/:id" element={<EntityPage />} />
          <Route path="metrics/:id" element={<MetricPage />} />
          <Route path="scatterplots/:id" element={<ScatterPlotPage />} />
          <Route path="structures/:id" element={<StructurePage />} />
          <Route path="protocolevents/:id" element={<ProtocolEventPage />} />
          <Route path="graphs" element={<GraphsPage />} />
          <Route path="graphs/:id/queries" element={<GraphGraphQueriesPage />} />
          <Route path="graphs/:id" element={<GraphPage />} />
          <Route path="graphqueries/:id" element={<GraphQueryPage />} />
          <Route path="graphqueries/:id/builder" element={<BuilderPage />} />
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
            path="entitycategories/:id/schema"
            element={<EntityCategorySchemaBuilderPage />}
          />
          <Route
            path="protocoleventcategories/:id"
            element={<ProtocolEventCategoryPage />}
          />
          <Route
            path="naturaleventcategories/:id"
            element={<NaturalEventCategoryPage />}
          />
          <Route
            path="measurementcategories/:id"
            element={<MeasurementCategoryPage />}
          />
          <Route path="graphs/:id/view/:viewid" element={<GraphPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModuleLayout>
    </Guard.Mikro>
  );
};

export default KraphModule;
