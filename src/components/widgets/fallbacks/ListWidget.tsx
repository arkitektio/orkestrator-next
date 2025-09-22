import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { ChildPortFragment, PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import { pathToName, portToDefaults } from "@/rekuest/widgets/utils";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ListChoicesWidget } from "../custom/ListChoicesWidget";
import { ListSearchWidget } from "../custom/ListSearchWidget";

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
        parentKind={PortKind.List}
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

  console.log("THE PATH", path);

  const { fields, append, remove } = useFieldArray({
    control,
    name: pathToName(path),
  });

  return (
    <FormItem>
      <FormLabel>{port.label || port.key} {JSON.stringify(portToDefaults([valuetype], {}))}</FormLabel>
      <FormControl>
        <ContainerGrid fitLength={fields.length}>
          {fields.map((item, index) => (
            <Card key={item.id} className="p-3 relative">
              <RenderDownWidget
                port={valuetype}
                path={path.concat(index.toString(), "__value")}
              />
              <Button
                variant="outline"
                size={"icon"}
                className="absolute top-0 right-0 mr-2 mt-2"
                onClick={(e) => { remove(index); e.preventDefault() }}
              >
                <X />
              </Button>
            </Card>
          ))}
          <TooltipButton
            variant="outline"
            size="icon"
            onClick={(e) => { append({ __value: portToDefaults([valuetype], {})[valuetype.key] }); e.preventDefault() }}
            tooltip="Add new item"
          >
            <Plus />
          </TooltipButton>
        </ContainerGrid>
      </FormControl>
    </FormItem>
  );
};

export const ListWidget = (props: InputWidgetProps) => {
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
