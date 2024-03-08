import { RegisteredAction } from "@/providers/command/CommandContext";

import { useExtension } from "../ExtensionContext";
import { CommandGroup, CommandItem } from "@/components/ui/command";

export const FilteredCommands = (props: {
  actions: RegisteredAction[] | undefined;
  heading: string;
}) => {
  const { query } = useExtension();

  const filtered =
    props.actions?.filter((action) => {
      return (
        query &&
        query.length > 0 &&
        action.label.toLowerCase().includes(query.toLowerCase())
      );
    }) || [];

  if (filtered.length == 0) {
    return <></>;
  }

  return (
    <>
      <CommandGroup heading={props.heading}>
        {filtered.map((action) => (
          <CommandItem
            key={action.key}
            value={action.key}
            onSelect={() => action.run()}
          >
            {action.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </>
  );
};
