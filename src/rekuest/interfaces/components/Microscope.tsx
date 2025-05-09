import { useState } from "react";
import { wrap } from "../wrap";
import { useInterfaceState, useInterfaceImplementation } from "../hooks/useAction";
import { Button } from "@/components/ui/button";
import { DetailImplementationFragment } from "@/rekuest/api/graphql";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";

const MoveButton = (props: { implementation: DetailImplementationFragment }) => {
  const { assign } = useImplementationAction({
    id: props.implementation.id,
  });

  const move = () => {
    assign({
      args: {
        x: 10,
      },
    });
  };

  return <Button onClick={move}>{props.implementation.interface}</Button>;
};

const Microscope = wrap(({ descriptor, agent }) => {
  const [count, setCount] = useState(0);

  const { data } = useInterfaceImplementation(descriptor, "movex", agent);

  const { data: state } = useInterfaceState(descriptor, "positioner", agent);

  return (
    <h1>
      dd{JSON.stringify(descriptor.actionRequirements)}
      {data?.implementationAt && <MoveButton implementation={data.implementationAt} />}
      {state?.stateFor && <div>{JSON.stringify(state.stateFor.value)}</div>}
    </h1>
  );
});

customElements.define("my-microscope", Microscope);

export default Microscope;
