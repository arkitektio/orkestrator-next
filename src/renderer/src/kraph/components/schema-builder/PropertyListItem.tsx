import { GripVertical, Search, Asterisk, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyDefinition, dataTypeConfigs } from "./utils";

interface PropertyListItemProps {
  property: PropertyDefinition;
  isActive: boolean;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export function PropertyListItem({
  property,
  isActive,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: PropertyListItemProps) {
  const typeConfig = dataTypeConfigs[property.valueKind];

  if (!typeConfig) {
    return null; // Skip rendering if config not found
  }

  const TypeIcon = typeConfig.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group",
        "hover:bg-accent/50",
        isActive && "bg-accent border-l-4 border-primary",
        isDragging && "opacity-50",
        !isActive && "border-l-4 border-transparent"
      )}
    >
      {/* Drag Handle */}
      <div className="opacity-50 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Type Icon */}
      <div
        className={cn(
          "p-2 rounded-md",
          typeConfig.color.bg,
          typeConfig.color.border,
          "border"
        )}
      >
        <TypeIcon className={cn("h-4 w-4", typeConfig.color.text)} />
      </div>

      {/* Label & Key Stack */}
      <div className="flex-1 min-w-0">
        <div className="font-medium font-sans truncate">{property.label}</div>
        <div className="text-xs text-muted-foreground font-mono truncate">
          {property.key}
        </div>
      </div>

      {/* Attribute Badges */}
      <div className="flex items-center gap-2">
        {property.searchable && (
          <div className="p-1 rounded bg-blue-100">
            <Search className="h-3 w-3 text-blue-700" />
          </div>
        )}
        {property.required && (
          <div className="p-1 rounded bg-red-100">
            <Asterisk className="h-3 w-3 text-red-700" />
          </div>
        )}
        {property.unique && (
          <div className="p-1 rounded bg-purple-100">
            <Fingerprint className="h-3 w-3 text-purple-700" />
          </div>
        )}
      </div>
    </div>
  );
}
