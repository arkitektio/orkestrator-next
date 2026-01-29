import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { WhereCondition } from "../OntologyGraphProvider";
import { MyNode } from "../types";

interface WhereClauseBuilderProps {
  node: MyNode;
  nodeId: string;
  existingConditions?: WhereCondition[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (conditions: WhereCondition[]) => void;
}

// Property configurations for different node types
const NODE_PROPERTIES: Record<string, Array<{ property: string; label: string; type: "string" | "number" | "boolean" }>> = {
  metriccategory: [
    { property: "value", label: "Label", type: "number" },
    { property: "metricKind", label: "Metric Kind", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
  entitycategory: [
    { property: "label", label: "Label", type: "string" },
    { property: "instanceKind", label: "Instance Kind", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
  structurecategory: [
    { property: "identifier", label: "Identifier", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
  protocoleventcategory: [
    { property: "label", label: "Label", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
  naturaleventcategory: [
    { property: "label", label: "Label", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
  reagentcategory: [
    { property: "label", label: "Label", type: "string" },
    { property: "description", label: "Description", type: "string" },
  ],
};

// Operators based on property type
const STRING_OPERATORS = ["=", "!=", "CONTAINS", "STARTS WITH", "ENDS WITH"] as const;
const NUMBER_OPERATORS = ["=", "!=", ">", "<", ">=", "<="] as const;
const BOOLEAN_OPERATORS = ["=", "!="] as const;

export const WhereClauseBuilder = ({
  node,
  nodeId,
  existingConditions = [],
  isOpen,
  onClose,
  onSave,
}: WhereClauseBuilderProps) => {
  const [conditions, setConditions] = useState<WhereCondition[]>(
    existingConditions.length > 0
      ? existingConditions
      : [{ property: "", operator: "=", value: "" }]
  );

  const nodeType = node.type || "unknown";
  const availableProperties = NODE_PROPERTIES[nodeType] || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeData = node.data as any;
  const nodeLabel = nodeData?.ageName || nodeData?.label || nodeData?.identifier || nodeId;

  const addCondition = () => {
    setConditions([
      ...conditions,
      { property: "", operator: "=", value: "" },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (
    index: number,
    field: keyof WhereCondition,
    value: string
  ) => {
    const newConditions = [...conditions];

    if (field === "property") {
      // When changing property, reset operator to default
      const propConfig = availableProperties.find((p) => p.property === value);
      if (propConfig) {
        newConditions[index] = {
          ...newConditions[index],
          property: value,
          operator: "=",
        };
      }
    } else if (field === "operator") {
      newConditions[index] = {
        ...newConditions[index],
        operator: value as WhereCondition["operator"],
      };
    } else if (field === "value") {
      // Try to parse as number if applicable
      const propConfig = availableProperties.find(
        (p) => p.property === newConditions[index].property
      );
      if (propConfig?.type === "number") {
        const numValue = parseFloat(value);
        newConditions[index] = {
          ...newConditions[index],
          value: isNaN(numValue) ? value : numValue,
        };
      } else {
        newConditions[index] = {
          ...newConditions[index],
          value,
        };
      }
    }

    setConditions(newConditions);
  };

  const getOperatorsForProperty = (property: string) => {
    const propConfig = availableProperties.find((p) => p.property === property);
    if (!propConfig) return STRING_OPERATORS;

    switch (propConfig.type) {
      case "number":
        return NUMBER_OPERATORS;
      case "boolean":
        return BOOLEAN_OPERATORS;
      default:
        return STRING_OPERATORS;
    }
  };

  const handleSave = () => {
    // Filter out incomplete conditions
    const validConditions = conditions.filter(
      (c) => c.property && c.operator && c.value !== ""
    );
    onSave(validConditions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add WHERE Filters</DialogTitle>
          <DialogDescription>
            Add property filters for node: <strong>{nodeLabel}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-end gap-2 border-b pb-4">
              <div className="flex-1 space-y-2">
                <Label>Property</Label>
                <Select
                  value={condition.property}
                  onValueChange={(value) =>
                    updateCondition(index, "property", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((prop) => (
                      <SelectItem key={prop.property} value={prop.property}>
                        {prop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    updateCondition(index, "operator", value)
                  }
                  disabled={!condition.property}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsForProperty(condition.property).map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label>Value</Label>
                <Input
                  value={String(condition.value)}
                  onChange={(e) =>
                    updateCondition(index, "value", e.target.value)
                  }
                  placeholder="Enter value"
                  disabled={!condition.property}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(index)}
                disabled={conditions.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            onClick={addCondition}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
