import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { Card } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { notEmpty } from "@/lib/utils";
import {
  ChildPortFragment,
  PortFragment,
  PortKind,
} from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import React, { useCallback, useEffect } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useForm,
  useFormContext,
} from "react-hook-form";

export type UnionValue = {
  use: number;
  value: any;
};

const RenderDownWidget = ({ port }: { port: ChildPortFragment }) => {
  const { registry } = useWidgetRegistry();
  const Widget = registry.getInputWidgetForPort(port);

  console.log(port);

  if (!port.key) {
    return <> Error </>;
  }

  return (
    <div className="mt-2">
      <Widget
        port={{
          ...port,
          key: port.key || "Should nerver happen",
          __typename: "Port",
        }}
        widget={port.assignWidget}
      />
    </div>
  );
};
const SubForm = ({
  port,
  children,
  field,
  parentKind,
}: {
  port: PortFragment | ChildPortFragment;
  children: ChildPortFragment[];
  field: ControllerRenderProps<FieldValues, string>;
  parentKind?: PortKind;
}) => {
  const form = useForm({
    defaultValues: field.value,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    watch,
    ...props
  } = form;

  function onSubmit(data: any) {
    console.log(data);
    console.log("Changing");

    field.onChange({});
  }
  useEffect(() => {
    // TypeScript users
    // const subscription = watch(() => handleSubmit(onSubmit)())
    const subscription = form.watch(form.handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <>
      <Form {...form}>
        {parentKind !== PortKind.List ? (
          <Card className="p-4">
            <h3 className="text-lg font-semibold">{port.label || port.key}</h3>

            {children.map((port, i) => (
              <RenderDownWidget port={port} key={i} />
            ))}
          </Card>
        ) : (
          <>
            {children.map((port, i) => (
              <RenderDownWidget port={port} key={i} />
            ))}
          </>
        )}
      </Form>
    </>
  );
};

const ModelWidget: React.FC<InputWidgetProps> = ({
  port,
  widget,
  parentKind,
}) => {
  const form = useFormContext();
  const validate = usePortValidate(port);

  return (
    <FormField
      control={form.control}
      name={port.key}
      rules={{ validate: validate }}
      render={({ field }) => (
        <SubForm
          port={port}
          children={port.children?.filter(notEmpty) || []}
          field={field}
          parentKind={parentKind}
        />
      )}
    />
  );
};

export { ModelWidget };
