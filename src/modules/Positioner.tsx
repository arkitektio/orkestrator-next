import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";

export const PositionerModule = buildModule({
  states: {
    positioner: buildState(
      {
        position_x: build.float(),
        position_y: build.float(),
        position_z: build.float(),
        stream: build.structure("@lok/stream"),
      },
      {
        forceHash:
          "29ee9ce201ddf421464d7f50d679c81c62b31d3c46f98b8643b9a856249243bc",
      },
    ),
  },
  actions: {
    moveY: buildAction(
      {
        y: build.float(),
      },
      {},
      {
        forceHash:
          "221142ddcfd6d5d32516a0f2cd62b8b423ac97dac11b61642ab98ac2646222ba",
      },
    ),
    moveX: buildAction(
      {
        y: build.float(),
      },
      {},
      {
        forceHash:
          "af50765bd3db8dc0f559be797942ad4b9fb31a75997f10821c6fdeb460e77188",
      },
    ),
  },
});

export const Positioner = () => {
  const { value } = PositionerModule.useState("positioner");

  const { assign, returns, done } = PositionerModule.useAction("moveY");

  if (!value) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className="positioner">{value.position_y.toFixed()}</div>;
      <button onClick={() => assign({ y: 1 })}>
        {done ? "Moving" : "MoveX"}
      </button>
    </>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
