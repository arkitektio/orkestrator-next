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
import ReagentPage from "./ReagentPage";
import ProtocolEventPage from "./ProtocolEventPage";


export default asDetailQueryRoute(useGetNodeQuery, (props) => {
  if (props.data.node.__typename == "Entity") {
    return <EntityPage />;
  }
  if (props.data.node.__typename == "Structure") {
    return <StructurePage />;
  }

  if (props.data.node.__typename == "Reagent") {
    return <ReagentPage  />;
  }

  return <> Unknown Type yet </>;
});
