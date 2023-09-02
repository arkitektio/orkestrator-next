import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { Form, FormField } from "@/components/ui/form";
import { notEmpty } from "@/lib/utils";
import { ChildPortFragment } from "@/rekuest/api/graphql";
import {
  InputWidgetProps,
  Port,
  portToLabel,
  useWidgetRegistry,
} from "@jhnnsrs/rekuest-next";
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
      port={{ ...port, key: "value" } as unknown as Port}
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
        <SearchField name="use" search={search} />
        {chosenVariant && <RenderDownWidget port={chosenVariant} />}
      </Form>
    </>
  );
};

const UnionWidget: React.FC<InputWidgetProps> = ({ port, widget }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={port.key}
      render={({ field }) => (
        <SubForm
          variants={port.variants?.filter(notEmpty) || []}
          field={field}
        />
      )}
    />
  );
};

export { UnionWidget };
