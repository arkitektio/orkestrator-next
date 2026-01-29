import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyListItem } from "./PropertyListItem";
import { PropertyDefinition } from "./utils";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropertyListProps {
  properties: PropertyDefinition[];
  selectedIndex: number | null;
  onSelectProperty: (index: number) => void;
  onAddProperty: () => void;
  onReorderProperties: (startIndex: number, endIndex: number) => void;
}

export function PropertyList({
  properties,
  selectedIndex,
  onSelectProperty,
  onAddProperty,
  onReorderProperties,
}: PropertyListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderProperties(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="h-full flex flex-col border-r bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-1">Properties</h2>
        <p className="text-sm text-muted-foreground">
          {properties.length} {properties.length === 1 ? "field" : "fields"}
        </p>
      </div>

      {/* Property List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {properties.map((property, index) => (
            <div
              key={property.key || index}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              className="relative"
            >
              {dropTargetIndex === index && draggedIndex !== index && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded -mt-1" />
              )}
              <PropertyListItem
                property={property}
                isActive={selectedIndex === index}
                onClick={() => onSelectProperty(index)}
                onDragStart={handleDragStart(index)}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Button */}
      <div className="p-4 border-t">
        <Button
          onClick={onAddProperty}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
    </div>
  );
}
