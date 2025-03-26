import { OntologyFragment } from "@/kraph/api/graphql";
import React, { ReactNode } from "react";

import { StagingEdgeParams, StagingNodeParams } from "./types";

export type OntologyGraphContextType = {
  ontology: OntologyFragment;
  addStagingEdge: (params: StagingEdgeParams) => void;
  addStagingNode: (params: StagingNodeParams) => void;
}

export const OntoloGraphContext = React.createContext<OntologyGraphContextType>(
  {} as unknown as OntologyGraphContextType
);

export const useOntologyGraph = () => {
  return React.useContext(OntoloGraphContext);
}

export const OntologyGraphProvider: React.FC<OntologyGraphContextType & {children: ReactNode}> = ({children, ...props }) => {
 


  return (
    <OntoloGraphContext.Provider value={props}>
      {children}
    </OntoloGraphContext.Provider>
  );
}