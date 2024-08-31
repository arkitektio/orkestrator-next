import React from "react";
import { useHashAction } from "../hooks/useHashActions";
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

export type Descriptor<
  T extends NodeRequirements,
  S extends StateRequirements,
> = {
  name: string;
  nodeRequirements: T;
  stateRequirements: S;
};

export const registerComponent = <
  T extends NodeRequirements,
  S extends StateRequirements,
>(
  descriptor: Descriptor<T, S>,
  component: (props: InterfaceProps<T, S>) => React.ReactNode,
) => {
  console.log(descriptor);

  return component;
};

export const useAgentState = <T extends StateRequirements>({
  hash,
  agent,
}: {
  hash: string;
  agent: string;
}) => {
  return {
    positionx: "3",
  };
};

registerComponent(
  {
    name: "Microscope",
    nodeRequirements: {
      positioner:
        "58bcc1b6487a801514b821a68cf6e792167320ade4179953de233cff85c1676c",
    },
    stateRequirements: {
      move_x:
        "48ba103c0a0f303f27491f398063485fefcc55f076c158b6a45a653211809bfa",
    },
  },
  (props) => {
    const positionx = useHashAction({
      hash: props.nodes.positioner,
      agent: props.agent.id,
    });

    const state = useAgentState({
      hash: props.states.move_x,
      agent: props.agent.id,
    });

    return (
      <div onClick={() => positionx.assign({ args: { step: "3" } })}>
        {" "}
        {state.positionx}
      </div>
    );
  },
);
