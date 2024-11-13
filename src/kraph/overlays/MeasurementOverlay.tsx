import { Card } from "@/components/ui/card";
import {
  KraphEntity,
  MikroEntityMetric,
  MikroEntityRelation,
  MikroROI,
} from "@/linkers";
import { useGetEntityQuery, useGetStructureQuery } from "../api/graphql";
import { Structure } from "@/types";
