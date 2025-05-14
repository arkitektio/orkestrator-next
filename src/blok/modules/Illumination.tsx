import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  build,
  buildAction,
  buildModule,
  buildState
} from "@/hooks/use-metaapp";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const IlluminationModule = buildModule({
  states: {
    illumination: buildState(
      {
        current_light_intensity: build.int(),
      },
      {
        forceHash:
          "c85e1ec9331ad60b40c061d42018865ccc283dbc24224c9a75f823c4b38a9bef",
      },
    ),
  },
  actions: {
    set: buildAction(
      {
        x: build.float(),
      },
      {},
      {
        forceHash:
          "126c98222e77315f81463da83f754ab071dcf45778f85877c794ad658118eec1",
      },
    ),
    toggle: buildAction(
      {
        x: build.float(),
      },
      {},
      {
        forceHash:
          "dd9c77ec90383a335d034d160e92509daf536b8efe4a97e0b86b40ef5c036d5a",
      },
    ),
  },
});

export function Illuminator() {
  const { value } = IlluminationModule.useState("illumination");

  const [state, setState] = useState(0);

  const debounce = useDebounce(state, 300);

  const { assign } = IlluminationModule.useAction("set", {
    ephemeral: true,
  });

  useEffect(() => {
    assign({ x: debounce });
  }, [debounce]);

  return (
    <div className="w-full max-w-md mx-auto @xl:p-6 @xl:space-y-6">
      <h2 className="text-2xl font-bold text-center @3xl:block hidden">
        Microscope Illumination Control
      </h2>

      <div className="space-y-2">
        <Label htmlFor="intensity-slider">
          Light Intensity:{" "}
          {value?.current_light_intensity != debounce && "...Settting"}
        </Label>
        <Slider
          id="intensity-slider"
          min={0}
          max={1000}
          step={1}
          value={[state]}
          onValueChange={(e) => {
            setState(e[0]);
            console.log(e);
          }}
          aria-label="Light intensity"
        />
      </div>

      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="282.7"
            strokeDashoffset={
              282.7 - (value?.current_light_intensity / 1000) * 282.7
            }
            className="text-yellow-400 transform -rotate-90 origin-center transition-all duration-300 ease-in-out"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#ff00ff50"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="282.7"
            strokeDashoffset={282.7 - (debounce / 1000) * 282.7}
            className="text-yellow-400 transform -rotate-90 origin-center transition-all duration-300 ease-in-out"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          aria-live="polite"
          aria-atomic="true"
        >
          {value?.current_light_intensity}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 @xl:block hidden">
        Adjust the slider to control the microscope's light intensity.
      </div>
    </div>
  );
}

export const IlluminatorBackup = () => {
  const { value } = IlluminationModule.useState("illumination");

  const { assign } = IlluminationModule.useAction("set", {
    ephemeral: true,
  });

  if (!value) {
    return <div>Loading</div>;
  }

  return (
    <div className="relative flex h-full flex-col">
      {value?.current_light_intensity}
      <Button onClick={() => assign({ x: value.current_light_intensity + 10 })}>
        Increase
      </Button>
      <Button onClick={() => assign({ x: value.current_light_intensity - 10 })}>
        Decrease
      </Button>
      <Button onClick={() => assign({ x: 0 })}>Off</Button>
      <Button onClick={() => assign({ x: 1000 })}>Max</Button>
    </div>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
