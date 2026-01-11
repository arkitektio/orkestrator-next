import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Trash2, AlertCircle } from "lucide-react";
import { PropertyDefinition, toSnakeCase, isValidMachineKey } from "./utils";
import { DataTypeSelector } from "./DataTypeSelector";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FieldError } from "react-hook-form";

interface PropertyInspectorProps {
  property: PropertyDefinition | null;
  onUpdate: (updates: Partial<PropertyDefinition>) => void;
  onDelete: () => void;
  errors?: Partial<Record<keyof PropertyDefinition, FieldError>>;
}

export function PropertyInspector({
  property,
  onUpdate,
  onDelete,
  errors,
}: PropertyInspectorProps) {
  const [autoGenerateKey, setAutoGenerateKey] = useState(true);

  if (!property) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
        <div>
          <p className="text-lg mb-2">No property selected</p>
          <p className="text-sm">
            Select a property from the list to edit its configuration
          </p>
        </div>
      </div>
    );
  }

  const keyError =
    property.key && !isValidMachineKey(property.key)
      ? "Key must start with a letter and contain only lowercase letters, numbers, and underscores"
      : null;

  const handleLabelChange = (label: string) => {
    onUpdate({ label });
    if (autoGenerateKey) {
      onUpdate({ label, key: toSnakeCase(label) });
    }
  };

  const handleKeyChange = (key: string) => {
    setAutoGenerateKey(false);
    onUpdate({ key });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Property Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure the details and behavior of this property
          </p>
        </div>

        {/* Validation Errors Summary */}
        {errors && Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-1">Validation Errors:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field}: {error?.message || "Invalid value"}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="label" className="text-base font-semibold">
            Display Name {errors?.label && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="label"
            value={property.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="e.g., Phone Number"
            className={`text-lg ${errors?.label ? "border-red-500" : ""}`}
          />
          {errors?.label && (
            <p className="text-xs text-red-600">{errors.label.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Human-readable name shown in the interface
          </p>
        </div>

        {/* Machine Key */}
        <div className="space-y-2">
          <Label htmlFor="key" className="text-base font-semibold">
            Machine Key {(errors?.key || keyError) && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="key"
            value={property.key}
            onChange={(e) => handleKeyChange(e.target.value)}
            placeholder="e.g., phone_number"
            className={`font-mono ${keyError || errors?.key ? "border-red-500" : ""}`}
          />
          {(keyError || errors?.key) && (
            <p className="text-xs text-red-600">{errors?.key?.message || keyError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Database identifier (lowercase, underscores only)
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={property.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the purpose of this property..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Help text to guide users filling in this field
          </p>
        </div>

        {/* Data Type Selector */}
        <fieldset className="space-y-3 border rounded-lg p-4">
          <legend className="text-base font-semibold px-2">Data Type</legend>
          <DataTypeSelector
            value={property.valueKind}
            onChange={(valueKind) => onUpdate({ valueKind })}
          />
        </fieldset>

        {/* Validation Settings */}
        <fieldset className="space-y-4 border rounded-lg p-4">
          <legend className="text-base font-semibold px-2">Validation</legend>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="optional" className="font-medium">
                Optional Field
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow this field to be empty
              </p>
            </div>
            <Switch
              id="optional"
              checked={property.optional}
              onCheckedChange={(optional) => onUpdate({ optional })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="required" className="font-medium">
                Required
              </Label>
              <p className="text-xs text-muted-foreground">
                Must have a value
              </p>
            </div>
            <Switch
              id="required"
              checked={property.required || false}
              onCheckedChange={(required) => onUpdate({ required })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="unique" className="font-medium">
                Unique
              </Label>
              <p className="text-xs text-muted-foreground">
                No duplicate values allowed
              </p>
            </div>
            <Switch
              id="unique"
              checked={property.unique || false}
              onCheckedChange={(unique) => onUpdate({ unique })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default" className="font-medium">
              Default Value
            </Label>
            <Input
              id="default"
              value={property.default || ""}
              onChange={(e) => onUpdate({ default: e.target.value })}
              placeholder="Optional default value"
            />
          </div>
        </fieldset>

        {/* Indexing & Search */}
        <fieldset className="space-y-4 border rounded-lg p-4">
          <legend className="text-base font-semibold px-2">
            Indexing & Search
          </legend>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="searchable" className="font-medium">
                Searchable
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable full-text search on this field
              </p>
            </div>
            <Switch
              id="searchable"
              checked={property.searchable || false}
              onCheckedChange={(searchable) => onUpdate({ searchable })}
            />
          </div>

          {property.searchable && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <InfoIcon className="h-4 w-4 text-yellow-800" />
              <AlertDescription className="text-yellow-800 text-xs">
                Enabling full-text search will create an index on this field,
                which may impact storage and query performance.
              </AlertDescription>
            </Alert>
          )}
        </fieldset>

        {/* Delete Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={onDelete}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
