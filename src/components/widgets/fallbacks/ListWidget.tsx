import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import { ListChoicesWidget } from "../custom/ListChoicesWidget";
import { ListSearchWidget } from "../custom/ListSearchWidget";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ControllerRenderProps,
  FieldValues,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ChildPortFragment, PortKind } from "@/rekuest/api/graphql";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { TooltipButton } from "@/components/ui/tooltip-button";

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
        parentKind={PortKind.List}
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

  const { fields, append, remove } = useFieldArray({
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
            <Card key={item.id} className="p-3">
              <RenderDownWidget
                name={`__values.${index}.value`}
                port={valuetype}
              />
              <Button
                variant="outline"
                size={"icon"}
                className="absolute top-0 right-0 mr-2 mt-2"
                onClick={() => remove(index)}
              >
                <X />
              </Button>
            </Card>
          ))}
        </ContainerGrid>

        <TooltipButton
          variant="outline"
          size="icon"
          onClick={() => append({ value: undefined })}
          tooltip="Add new item"
        >
          <Plus />
        </TooltipButton>
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
        <FormItem>
          <FormLabel>{port.label ? port.label : port.key}</FormLabel>
          <FormControl>
            <SubForm valuetype={valuetype || []} field={field} />
          </FormControl>
          <FormDescription>{port.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const ListWidget = (props: InputWidgetProps) => {
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

  if (child?.assignWidget?.__typename == "SearchAssignWidget") {
    return <ListSearchWidget {...props} widget={child.assignWidget} />;
  }

  if (child?.assignWidget?.__typename == "ChoiceAssignWidget") {
    return <ListChoicesWidget {...props} widget={child.assignWidget} />;
  }

  return <SideBySideWidget {...props} valuetype={child} />;
};
