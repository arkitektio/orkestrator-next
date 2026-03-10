import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, CircleHelp, InfoIcon, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { AggregationFunction, DerivationType } from "../../api/graphql";
import { DataTypeSelector } from "./DataTypeSelector";
import {
  DEFAULT_AGGREGATION,
  DEFAULT_DERIVATION,
  isValidMachineKey,
  PropertyDefinition,
  toSnakeCase,
} from "./utils";

interface PropertyInspectorProps {
  property: PropertyDefinition | null;
  onUpdate: (updates: Partial<PropertyDefinition>) => void;
  onDelete: () => void;
  errors?: Record<string, any>;
}

export function PropertyInspector({
  property,
  onUpdate,
  onDelete,
  errors,
}: PropertyInspectorProps) {
  const [autoGenerateKey, setAutoGenerateKey] = useState(true);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);

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
          <legend className="text-base font-semibold px-2 flex items-center gap-1.5">
            Data Type
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <CircleHelp className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Select the value format this field should store.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </legend>
          <DataTypeSelector
            value={property.valueKind}
            onChange={(valueKind) => onUpdate({ valueKind })}
          />
        </fieldset>

        {/* Indexing & Search */}
        <fieldset className="space-y-4 border rounded-lg p-4">
          <legend className="text-base font-semibold px-2">
            Indexing & Search
          </legend>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="index" className="font-medium">
                Indexed
              </Label>
              <p className="text-xs text-muted-foreground">
                Improves filtering and sorting speed for this field
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground mr-2">
                    <CircleHelp className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Indexes speed up filtering and ordering on this field.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              id="index"
              checked={property.index || false}
              onCheckedChange={(index) => onUpdate({ index })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="searchable" className="font-medium">
                Searchable
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable full-text search on this field
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground mr-2">
                    <CircleHelp className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Enables full-text search matching for this field.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              id="searchable"
              checked={property.searchable || false}
              onCheckedChange={(searchable) => onUpdate({ searchable })}
            />
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium flex items-center gap-1.5">
                  Derivation Rule
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground">
                          <CircleHelp className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Defines how supporting evidence fills this field.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Auto-fills from supporting evidence using <span className="font-medium lowercase">{(property.rule?.aggregation || DEFAULT_AGGREGATION).toLowerCase()}</span>.
                </p>
              </div>
              <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Derivation Rule</DialogTitle>
                    <DialogDescription>
                      Choose how this field should be filled from supporting evidence. Aggregation defines which evidence values are used to compute the final value for this field.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Derivation Type</Label>
                      <Select
                        value={property.derivation || DEFAULT_DERIVATION}
                        onValueChange={(derivation) =>
                          onUpdate({ derivation: derivation as DerivationType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select derivation" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DerivationType).map((derivation) => (
                            <SelectItem key={derivation} value={derivation}>
                              {derivation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Aggregation</Label>
                      <Select
                        value={
                          property.rule?.aggregation || DEFAULT_AGGREGATION
                        }
                        onValueChange={(aggregation) =>
                          onUpdate({
                            derivation: property.derivation || DEFAULT_DERIVATION,
                            rule: {
                              ...property.rule,
                              aggregation:
                                aggregation as AggregationFunction,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select aggregation" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AggregationFunction).map((aggregation) => (
                            <SelectItem key={aggregation} value={aggregation}>
                              {aggregation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
