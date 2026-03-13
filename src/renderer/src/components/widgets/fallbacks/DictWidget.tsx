import { StringField } from "@/components/fields/StringField";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { ChildPortFragment, PortKind } from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

const RenderDownWidget = ({
  port,
  path,
}: {
  port: ChildPortFragment;
  path: string[];
}) => {
  const { registry } = useWidgetRegistry();
  const Widget = registry.getInputWidgetForPort(port);

  console.log(port);
  return (
    <div className="mt-2">
      <Widget
        port={{ ...port, __typename: "Port" } as Port}
        parentKind={PortKind.Dict}
        widget={port.assignWidget}
        path={path}
      />
    </div>
  );
};

export const SideBySideWidget = ({
  port,
  valuetype,
  path,
}: InputWidgetProps & { valuetype: ChildPortFragment }) => {
  const control = useFormContext().control;

  const { fields, append, remove } = useFieldArray({
    control,
    name: pathToName(path),
  });

  return (
    <ContainerGrid fitLength={fields.length}>
      {fields.map((item, index) => (
        <Card key={item.id} className="p-3">
          <StringField
            name={pathToName(path.concat(index.toString(), "__key"))}
            label="The Key"
            description="The key of this entry"
          />
          <RenderDownWidget
            port={valuetype}
            path={path.concat(index.toString(), "__value")}
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
      <TooltipButton
        variant="outline"
        size="icon"
        onClick={() => append({ __value: undefined })}
        tooltip="Add new item"
      >
        <Plus />
      </TooltipButton>
    </ContainerGrid>
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

  const child = props.port.children?.at(0);

  if (!child) {
    return <>Faulty port config. no child</>;
  }

  return <SideBySideWidget {...props} valuetype={child} />;
};
