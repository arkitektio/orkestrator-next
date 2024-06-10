import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Switch } from "../ui/switch";
import { FieldProps } from "./types";
import { Slider } from "../ui/slider";

function throttle<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let latestArgs: Parameters<T>;

  return function (...args: Parameters<T>) {
    latestArgs = args;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...latestArgs);
      timeout = null;
    }, wait);
  };
}

export const SliderField = (
  props: FieldProps & {
    min?: number;
    max?: number;
    step?: number;
    throttle?: number;
  },
) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      rules={{ validate: props.validate }}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center justify-between w-full">
            <FormLabel>
              {props.label != undefined ? props.label : props.name}
            </FormLabel>
            {JSON.stringify(field.value)}

            <FormControl>
              <Slider
                value={[field.value]}
                onValueChange={(z) => {
                  if (props.throttle) {
                    throttle(field.onChange(z[0]), props.throttle);
                  } else field.onChange(z[0]);
                }}
                min={props.min}
                max={props.max}
                step={props.step}
              />
            </FormControl>
          </div>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
