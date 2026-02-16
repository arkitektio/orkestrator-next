import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetNodeQuery } from "../api/graphql";

import EntityPage from "./EntityPage";
import StructurePage from "./StructurePage";


export default asDetailQueryRoute(useGetNodeQuery, (props) => {
  if (props.data.node.__typename == "Entity") {
    return <EntityPage />;
  }
  if (props.data.node.__typename == "Structure") {
    return <StructurePage />;
  }

  if (props.data.node.__typename == "Reagent") {
    return <ReagentPage />;
  }

  return <> Unknown Type yet </>;
});
