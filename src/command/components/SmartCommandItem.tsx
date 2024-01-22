import { CommandItem } from "@/components/ui/command";
import { useExtension } from "../ExtensionContext";

export const SmartCommandItem = (props: {
  identifier: string;
  id: string;
  label?: string;
}) => {
  const { activateModifier } = useExtension();

  return (
    <CommandItem
      key={props.identifier + ":" + props.id}
      value={props.identifier + ":" + props.id}
      onSelect={() =>
        activateModifier({
          type: "smart",
          identifier: props.identifier,
          id: props.id,
          label: props.label,
        })
      }
    >
      {props.label}
    </CommandItem>
  );
};
