import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommand } from "@/providers/command/CommandContext";

export const LocalActionExtensions = () => {
    const { actions } = useCommand();
  
    return (
      <>
        {actions.length > 0 && (
          <CommandGroup heading="Local Actions">
            {actions?.map((action) => {
              return (
                <CommandItem
                  key={action.key}
                  value={action.key}
                  onSelect={() => action.run()}
                  className="flex-row items-center justify-between"
                >
                  {action.label}
                  {action.description && (
                    <div className="text-xs ml-1">{action.description}</div>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </>
    );
  };