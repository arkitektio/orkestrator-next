import { ValueKind } from "../../api/graphql";
import { dataTypeConfigs } from "./utils";
import { cn } from "@/lib/utils";

interface DataTypeSelectorProps {
  value: ValueKind;
  onChange: (value: ValueKind) => void;
}

export function DataTypeSelector({ value, onChange }: DataTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(dataTypeConfigs).map(([kind, config]) => {
        const Icon = config.icon;
        const isSelected = value === kind;

        return (
          <button
            key={kind}
            type="button"
            onClick={() => onChange(kind as ValueKind)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
              "hover:scale-105",
              isSelected
                ? `${config.color.border} ${config.color.bg} border-current`
                : "border-border bg-background hover:bg-accent"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                isSelected ? config.color.text : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isSelected ? config.color.text : "text-muted-foreground"
              )}
            >
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
