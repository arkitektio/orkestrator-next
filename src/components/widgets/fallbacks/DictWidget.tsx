import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import { ListChoicesWidget } from "../custom/ListChoicesWidget";
import { ListSearchWidget } from "../custom/ListSearchWidget";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { ChildPortFragment } from "@/rekuest/api/graphql";
import { Form, FormField } from "@/components/ui/form";
import {
  ControllerRenderProps,
  FieldValues,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useCallback, useEffect } from "react";
import { portToLabel } from "@/rekuest/widgets/utils";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { Input } from "@/components/ui/input";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Card } from "@/components/ui/card";
import { StringField } from "@/components/fields/StringField";

const RenderDownWidget = ({
  port,
  name,
}: {
  port: ChildPortFragment;
  name: string;
}) => {
  const { registry } = useWidgetRegistry();
  const Widget = registry.getInputWidgetForPort(port);

  console.log(port);

  return (
    <div className="mt-2">
      <Widget
        port={
          { ...port, key: name, label: "The Value", __typename: "Port" } as Port
        }
        widget={port.assignWidget}
      />
    </div>
  );
};

const SubForm = ({
  valuetype,
  field,
}: {
  valuetype: ChildPortFragment;
  field: ControllerRenderProps<FieldValues, string>;
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

  const use = watch("use");

  function onSubmit(data: any) {
    console.log(data);
    console.log("Changing");

    field.onChange({});
  }

  const { fields, append, remove } = useFieldArray<{
    key: string;
    value: string;
  }>({
    control,
    name: "__values",
  });

  useEffect(() => {
    // TypeScript users
    // const subscription = watch(() => handleSubmit(onSubmit)())
    const subscription = watch(handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <>
      <Form {...form}>
        <ContainerGrid fitLength={fields.length}>
          {fields.map((item, index) => (
            <Card key={item.id} className="p-4">
              <StringField
                name={`__values.${index}.key`}
                label="The Key"
                description="The key of this entry"
                validate={(v) => {
                  if (!v) {
                    return "Key is required";
                  }
                  console.log(v);
                  if (fields.filter((f) => f.key === v).length > 1) {
                    return "Key must be unique";
                  }
                }}
              />

              <RenderDownWidget
                name={`__values.${index}.value`}
                label="The Value"
                port={valuetype}
                description="The value of this entry"
              />
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </Card>
          ))}
        </ContainerGrid>
        <button type="button" onClick={() => append({ key: "newkey" })}>
          append
        </button>
      </Form>
    </>
  );
};

export const SideBySideWidget = ({
  port,
  valuetype,
}: InputWidgetProps & { valuetype: ChildPortFragment }) => {
  const form = useFormContext();
  const validate = usePortValidate(port);

  return (
    <FormField
      control={form.control}
      name={port.key}
      rules={{ validate: validate }}
      render={({ field }) => (
        <SubForm valuetype={valuetype || []} field={field} />
      )}
    />
  );
};

export const DictWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  if (!props.port.children) {
    return <>Faulty port config. no children</>;
  }

  if (props.port.children.length != 1) {
    return (
      <>
        Faulty port config. not the adequat amount of children. Expected 1 go{" "}
        {props.port.children.length}
      </>
    );
  }

  let child = props.port.children?.at(0);

  if (!child) {
    return <>Faulty port config. no child</>;
  }

  return <SideBySideWidget {...props} valuetype={child} />;
};
