import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const IlluminationModule = buildModule({
  name: "Illumination",
  description: "Controls the microscope illumination and light intensity.",
  states: {
    illumination: buildState({
      keys: {
        current_light_intensity: build.int(),
      },
    }),
  },
  actions: {
    set: buildAction({
      args: {
        x: build.int(),
      },
      name: "Set Light Intensity",
    }),
  },
});

export function Illuminator() {
  const { value } = IlluminationModule.useState("illumination");

  const [state, setState] = useState(value?.current_light_intensity || 0);

  const debounce = useDebounce(state, 300);

  const { assign } = IlluminationModule.useAction("set");

  useEffect(() => {
    if (value?.current_light_intensity === debounce) return;
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

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
