import { AgentFragment } from "../api/graphql";

export type StateRequirements = {
  [key: string]: string;
};

export type ActionRequirements = {
  [key: string]: string;
};

export type InterfaceProps<
  T extends ActionRequirements,
  S extends StateRequirements,
> = {
  states: S;
  actions: T;
  agent: AgentFragment;
};

export type InterfaceDefinition<
  T extends ActionRequirements,
  S extends StateRequirements,
> = {
  actionRequirements: T;
  stateRequirements: S;
};

export type Descriptor<
  T extends ActionRequirements,
  S extends StateRequirements,
> = {
  name: string;
  loader: () => Promise<any>;
  componentname: string;
} & InterfaceDefinition<T, S>;
