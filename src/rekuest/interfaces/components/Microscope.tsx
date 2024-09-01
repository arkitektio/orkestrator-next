import { useState } from "react";
import { wrap } from "../wrap";
import { useInterfaceState, useInterfaceTemplate } from "../hooks/useNode";
import { Button } from "@/components/ui/button";
import { DetailTemplateFragment } from "@/rekuest/api/graphql";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";

const MoveButton = (props: { template: DetailTemplateFragment }) => {
  const { assign } = useTemplateAction({
    id: props.template.id,
  });

  const move = () => {
    assign({
      args: {
        x: 10,
      },
    });
  };

  return <Button onClick={move}>{props.template.interface}</Button>;
};

const Microscope = wrap(({ descriptor, agent }) => {
  const [count, setCount] = useState(0);

  const { data } = useInterfaceTemplate(descriptor, "movex", agent);

  const { data: state } = useInterfaceState(descriptor, "positioner", agent);

  return (
    <h1>
      dd{JSON.stringify(descriptor.nodeRequirements)}
      {data?.templateAt && <MoveButton template={data.templateAt} />}
      {state?.stateFor && <div>{JSON.stringify(state.stateFor.value)}</div>}
    </h1>
  );
});

customElements.define("my-microscope", Microscope);

export default Microscope;
