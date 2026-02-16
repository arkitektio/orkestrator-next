import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { GetEntityDocument, ValueKind, PropertyDefinitionFragment } from "@/kraph/api/graphql";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const PropertyEditor = ({
  entityId,
  definition,
  value,
}: {
  entityId: string;
  definition: PropertyDefinitionFragment;
  value: string | number | boolean | null | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [setNodeProperty, { loading }] = useSetNodePropertyMutation({
    refetchQueries: [{ query: GetEntityDocument, variables: { id: entityId } }],
  });

  const handleSave = async () => {
    try {
      await setNodeProperty({
        variables: {
          input: {
            entity: entityId,
            variable: definition.key,
            value: currentValue !== null ? String(currentValue) : null,
          },
        },
      });
      setIsOpen(false);
      toast.success("Property updated");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update property");
    }
  };

  const renderInput = () => {
    switch (definition.valueKind) {
      case ValueKind.Boolean:
        return (
          <div className="flex items-center gap-2">
            <Button
              variant={currentValue === "true" || currentValue === true ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentValue(true)}
            >
              True
            </Button>
            <Button
              variant={currentValue === "false" || currentValue === false ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentValue(false)}
            >
              False
            </Button>
          </div>
        );
      case ValueKind.Int:
        return (
          <Input
            type="number"
            step="1"
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
      case ValueKind.Float:
        return (
          <Input
            type="number"
            step="any"
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
      case ValueKind.Datetime:
        return (
          <DateTimePicker
            value={currentValue ? new Date(currentValue) : undefined}
            onChange={(date) => setCurrentValue(date?.toISOString())}
          />
        );
      case ValueKind.String:
        if (definition.description && definition.description.length > 50) {
          return (
            <Textarea
              value={currentValue || ""}
              onChange={(e) => setCurrentValue(e.target.value)}
              rows={3}
            />
          );
        }
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
      default:
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{definition.label || definition.key}</h4>
            <p className="text-sm text-muted-foreground">
              {definition.description || "Update property value"}
            </p>
          </div>
          {renderInput()}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
