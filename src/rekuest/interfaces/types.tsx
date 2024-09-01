import { AgentFragment } from "../api/graphql";

export type StateRequirements = {
  [key: string]: string;
};

export type NodeRequirements = {
  [key: string]: string;
};

export type InterfaceProps<
  T extends NodeRequirements,
  S extends StateRequirements,
> = {
  states: S;
  nodes: T;
  agent: AgentFragment;
};

export type InterfaceDefinition<
  T extends NodeRequirements,
  S extends StateRequirements,
> = {
  nodeRequirements: T;
  stateRequirements: S;
};

export type Descriptor<
  T extends NodeRequirements,
  S extends StateRequirements,
> = {
  name: string;
  loader: () => Promise<any>;
  componentname: string;
} & InterfaceDefinition<T, S>;
