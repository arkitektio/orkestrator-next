import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { Form, FormField } from "@/components/ui/form";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notEmpty } from "@/lib/utils";
import { ChildPortFragment } from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { portToLabel } from "@/rekuest/widgets/utils";
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

  return (
    <Widget
      port={{ ...port, key: "value", label: "" } as unknown}
      widget={port.assignWidget}
    />
  );
};

const SubForm = ({
  variants,
  field,
}: {
  variants: ChildPortFragment[];
  field: ControllerRenderProps<FieldValues, string>;
}) => {
  const form = useForm({
    defaultValues: field.value,
  });

  const use = form.watch("use");
  const chosenVariant = variants.at(parseInt(use));

  function onSubmit(data: any) {
    field.onChange(data);
  }

  console.log(variants);

  let choices = variants.map((v, i) => ({
    label: portToLabel(v),
    value: i.toString(),
  }));

  useEffect(() => {
    // TypeScript users
    // const subscription = watch(() => handleSubmit(onSubmit)())
    const subscription = form.watch(form.handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  const search = useCallback(
    async (searching: SearchOptions) => {
      if (searching.search) {
        return choices
          .filter(notEmpty)
          .filter((c) => c.label.startsWith(searching.search || ""));
      }
      if (searching.values != undefined) {
        return choices
          .filter(notEmpty)
          .filter((c) => searching.values?.includes(c.value));
      }
      return choices.filter(notEmpty);
    },
    [choices],
  );

  return (
    <>
      <Form {...form}>
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full mb-1">
          {choices.map((c) => (
            <div
              className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              data-state={use == c.value && "active"}
              onClick={() => form.setValue("use", c.value)}
            >
              {c.label}
            </div>
          ))}
        </div>
        {chosenVariant && <RenderDownWidget port={chosenVariant} />}
      </Form>
    </>
  );
};

const UnionWidget: React.FC<InputWidgetProps> = ({ port, widget }) => {
  const form = useFormContext();
  const validate = usePortValidate(port);
  return (
    <FormField
      control={form.control}
      name={port.key}
      rules={{ validate: validate }}
      render={({ field }) => (
        <SubForm
          variants={port.children?.filter(notEmpty) || []}
          field={field}
        />
      )}
    />
  );
};

export { UnionWidget };
