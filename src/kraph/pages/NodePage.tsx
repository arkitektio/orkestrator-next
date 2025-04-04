import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetNodeQuery } from "../api/graphql";

import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import {
  KraphEntity,
  KraphNaturalEvent,
  KraphNode,
  KraphProtocol,
  KraphProtocolEvent,
  KraphReagent,
} from "@/linkers";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import EntityPage from "./EntityPage";
import StructurePage from "./StructurePage";

export default asDetailQueryRoute(useGetNodeQuery, (props) => {
  if (props.data.node.__typename == "Entity") {
    return <EntityPage {...props} />;
  }
  if (props.data.node.__typename == "Structure") {
    return <StructurePage {...props} />;
  }

  return <> Unknown Type yet </>;
});
