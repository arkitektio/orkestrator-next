import { FormField } from "@/components/ui/form";
import { notEmpty } from "@/lib/utils";
import { ChildPortFragment, PortKind } from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import { pathToName, portToLabel } from "@/rekuest/widgets/utils";
import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";

const RenderDownWidget = ({
  port,
  path,
}: {
  port: ChildPortFragment;
  path: string[];
}) => {
  const { registry } = useWidgetRegistry();
  const Widget = registry.getInputWidgetForPort(port);

  return (
    <div className="mt-2">
      <Widget
        port={{ ...port, __typename: "Port" } as Port}
        parentKind={PortKind.Union}
        widget={port.assignWidget}
        path={path}
      />
    </div>
  );
};

const SubForm = ({
  variants,
  field,
  path,
}: {
  variants: ChildPortFragment[];
  field: ControllerRenderProps<FieldValues, string>;
  path: string[];
}) => {
  const form = useFormContext();

  const chosenVariant = field.value && variants[field.value.__use];

  const choices = variants.map((v, i) => ({
    label: portToLabel(v),
    value: i.toString(),
  }));

  return (
    <div className="@container">
      <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground w-full mb-1">
        {choices.map((c) => (
          <div
            key={c.value}
            className="cursor-pointer inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            data-state={field.value && field.value.__use == c.value && "active"}
            onClick={() =>
              form.setValue(pathToName(path), {
                __use: c.value,
                __value: undefined,
              })
            }
          >
            {c.label}
          </div>
        ))}
      </div>
      {chosenVariant && (
        <RenderDownWidget port={chosenVariant} path={path.concat("__value")} />
      )}
    </div>
  );
};

const UnionWidget: React.FC<InputWidgetProps> = ({ port, path }) => {
  const form = useFormContext();
  const validate = usePortValidate(port);
  return (
    <FormField
      control={form.control}
      name={pathToName(path)}
      rules={{ validate: validate }}
      render={({ field }) => (
        <SubForm
          variants={port.children?.filter(notEmpty) || []}
          field={field}
          path={path}
        />
      )}
    />
  );
};

export { UnionWidget };
