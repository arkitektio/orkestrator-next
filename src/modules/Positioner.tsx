import {
  buildAction,
  buildModule,
  buildState,
  port,
  ports,
} from "@/hooks/use-metaapp";

export const PositionerModule = buildModule({
  states: {
    positioner: buildState(
      ports({
        position_x: port.number,
        position_y: port.integer,
        position_z: port.number,
        stream: port.structure,
      }),
      { forceHash: "positioner" },
    ),
  },
  actions: {
    moveX: buildAction(
      ports({
        x: port.number,
      }),
      ports({
        x: port.number,
      }),
    ),
    moveY: buildAction(
      ports({
        y: port.number,
      }),
      ports({
        y: port.number,
      }),
    ),
  },
});

export const Positioner = () => {
  const { value } = PositionerModule.useState("positioner");

  const [moveX, { loading }] = PositionerModule.useAction("moveX");

  return (
    <>
      <div className="positioner">{value?.position_y.toFixed()}</div>;
      <button onClick={() => moveX({ x: 1 })}>
        {loading ? "Moving" : "MoveX"}
      </button>
    </>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
