import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useForm } from "react-hook-form";
import {
  GetEntityGraphQuery,
  useGetEntityGraphLazyQuery,
  useGetEntityGraphQuery,
  useGetEntityQuery,
  useSearchOntologiesLazyQuery,
} from "../api/graphql";

import { SearchField, SearchFunction } from "@/components/fields/SearchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MikroEntity,
  MikroEntityRelation,
  MikroImage,
  MikroROI,
  MikroSubjection,
} from "@/linkers";
import cise from "cytoscape-cise";
import dagre from "cytoscape-dagre";
import { useNavigate, useParams } from "react-router-dom";
import { ImageRGBD, RoiRGBD } from "../components/render/TwoDThree";

export default asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  return (
    <MikroEntity.ModelPage
      title={data.entity.name}
      object={data.entity.id}
      pageActions={
        <MikroEntity.DetailLink object={data.entity.id} subroute="graph">
          <Button variant="outline" size="sm">
            Graph
          </Button>
        </MikroEntity.DetailLink>
      }
    >
      <MikroEntity.DetailLink object={data.entity.id}>
        {data?.entity?.linkedExpression.expression.label}
      </MikroEntity.DetailLink>

      <div className="font-bold text-xl"> Marked as ROI in </div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.rois.map((roi, i) => (
          <MikroROI.DetailLink
            object={roi.id}
            className={"p-2 truncate w-[200px] h-[200px] border-0 "}
          >
            <RoiRGBD roi={roi} />
          </MikroROI.DetailLink>
        ))}
      </div>

      <div className="font-bold text-xl"> Is Specimen of </div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.specimenViews.map((spec, i) => (
          <Card className="p-2 truncate">
            <MikroImage.DetailLink
              object={spec.image.id}
              className={"max-w-[80px] truncate "}
            >
              <ImageRGBD image={spec.image} />
            </MikroImage.DetailLink>
          </Card>
        ))}
      </div>

      <div className="font-bold text-xl"> Was subjected to</div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.subjectedTo.map((sub, i) => (
          <Card className="p-2 truncate">
            <MikroSubjection.DetailLink
              object={sub.id}
              className={"max-w-[80px] truncate "}
            >
              {sub.id}
            </MikroSubjection.DetailLink>
          </Card>
        ))}
      </div>

      <div className="font-bold text-xl"> Relates to</div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.relations.map((rel, i) => (
          <Card className="p-2 truncate">
            <MikroEntityRelation.DetailLink
              object={rel.id}
              className={"max-w-[80px] truncate "}
            >
              {rel.right.linkedExpression.expression.label}
            </MikroEntityRelation.DetailLink>
          </Card>
        ))}
      </div>
    </MikroEntity.ModelPage>
  );
});
