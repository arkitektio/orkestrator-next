import { useMemo } from "react";
import { useFormContext } from "react-hook-form";


const resolveValue = (
  values: Record<string, any>,
  wanted_path: string,
  my_path: string[],
) => {
  if (my_path.length === 0) {
    return values[wanted_path];
  }

  let fullPath: string[] = [];

  if (wanted_path.startsWith("/")) {
    // Absolute path from root
    fullPath = wanted_path.slice(1).split("/");
  } else {
    // Relative neighbor from parent
    const parentPath = my_path.slice(0, -1);
    fullPath = [...parentPath, ...wanted_path.split("/")];
  }

  // Navigate through values
  let current: any = values;
  for (const part of fullPath) {
    if (current == null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  console.log("Resolved value", current, fullPath, values, wanted_path, my_path);

  return current;
};

export const useWidgetDependencies = (props: {
  widget: {
    dependencies?: string[] | null | undefined;
  };
  path: string[];
}) => {

  const form = useFormContext();

  const values = useMemo(() => form.getValues(), [form.formState]);

  const foundValues = useMemo(() => {
    return (
      (props.widget?.dependencies || [])
        .map((wanted_path, index) => {
          return { ["arg" + index]: resolveValue(values, wanted_path, props.path) };
        })
        .reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {}) || {}
    );
  }, [values, props.widget?.dependencies]);


  console.log("Found values", foundValues, props.widget?.dependencies, foundValues.length, props.widget?.dependencies?.length);

  return {
    values: foundValues,
    met: !props.widget.dependencies || props.widget.dependencies.length == 0 || Object.keys(foundValues).length == props.widget.dependencies?.length
  }
}


export default useWidgetDependencies;