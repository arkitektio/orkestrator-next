import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Plus, Trash2 } from "lucide-react";
import { MigrationPlan } from "./migration";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: MigrationPlan;
  entityCount: number;
  onConfirm: (defaultValues: Record<string, string>) => void;
  onCancel: () => void;
}

export function MigrationDialog({
  open,
  onOpenChange,
  plan,
  entityCount,
  onConfirm,
  onCancel,
}: MigrationDialogProps) {
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>({});

  const handleConfirm = () => {
    // Convert string values to appropriate types
    const processedValues: Record<string, string> = {};
    for (const [key, value] of Object.entries(defaultValues)) {
      if (value === "") continue;
      processedValues[key] = value;
    }
    onConfirm(processedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Schema Migration Required</DialogTitle>
          <DialogDescription>
            Your schema changes will affect {entityCount} existing{" "}
            {entityCount === 1 ? "entity" : "entities"}. Review the changes
            below.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {/* Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Migration will update all existing entities to match the new
                schema. This operation cannot be undone.
              </AlertDescription>
            </Alert>

            {/* Additions */}
            {plan.additions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">
                    <Plus className="h-3 w-3 mr-1" />
                    {plan.additions.length} New{" "}
                    {plan.additions.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-green-200">
                  {plan.additions.map((prop) => (
                    <div
                      key={prop.key}
                      className="p-3 bg-green-50 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{prop.label}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {prop.key}
                          </div>
                        </div>
                        <Badge variant="outline">{prop.valueKind}</Badge>
                      </div>
                      {!prop.optional && (
                        <div className="space-y-1">
                          <Label htmlFor={`default-${prop.key}`} className="text-xs">
                            Default value for existing entities
                            {!prop.default && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Input
                            id={`default-${prop.key}`}
                            value={defaultValues[prop.key] || prop.default || ""}
                            onChange={(e) =>
                              setDefaultValues((prev) => ({
                                ...prev,
                                [prop.key]: e.target.value,
                              }))
                            }
                            placeholder={
                              prop.default || "Enter default value..."
                            }
                            className="text-sm"
                          />
                          {!prop.default && !defaultValues[prop.key] && (
                            <p className="text-xs text-red-600">
                              Required: This property is not optional
                            </p>
                          )}
                        </div>
                      )}
                      {prop.optional && prop.default && (
                        <p className="text-xs text-muted-foreground">
                          Default: {prop.default}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Renames */}
            {plan.renames.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-blue-500">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    {plan.renames.length} Renamed{" "}
                    {plan.renames.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                  {plan.renames.map((rename) => (
                    <div
                      key={rename.newKey}
                      className="p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                          {rename.oldKey}
                        </code>
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                          {rename.newKey}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Data will be migrated from the old key to the new key
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Removals */}
            {plan.removals.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-red-500">
                    <Trash2 className="h-3 w-3 mr-1" />
                    {plan.removals.length} Removed{" "}
                    {plan.removals.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-red-200">
                  {plan.removals.map((key) => (
                    <div key={key} className="p-3 bg-red-50 rounded-lg">
                      <code className="text-sm font-mono">{key}</code>
                      <p className="text-xs text-muted-foreground mt-1">
                        This property will be removed from all entities
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              plan.additions.some(
                (p) => !p.optional && !p.default && !defaultValues[p.key]
              )
            }
          >
            Migrate {entityCount} {entityCount === 1 ? "Entity" : "Entities"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
