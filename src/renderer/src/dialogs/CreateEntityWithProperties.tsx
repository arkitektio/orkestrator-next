import { useDialog } from "@/app/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  EntityCategoryFragment,
  PropertyDefinitionFragment,
  useCreateEntityMutation,
  ValueKind,
} from "@/kraph/api/graphql";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

type PropertyValue = string | number | boolean | Date | null | undefined;

type CreateEntityFormData = {
  externalId?: string;
  name?: string;
  properties: Record<string, PropertyValue>;
};

const validateProperty = (
  value: PropertyValue,
  definition: PropertyDefinitionFragment,
): string | null => {
  // Check if required
  if (!definition.optional && (value === null || value === undefined || value === "")) {
    return `${definition.label || definition.key} is required`;
  }

  // Type-specific validation
  if (value !== null && value !== undefined && value !== "") {
    switch (definition.valueKind) {
      case ValueKind.Int:
        if (typeof value === "string" && isNaN(parseInt(value))) {
          return `${definition.label || definition.key} must be a valid integer`;
        }
        break;

      case ValueKind  .Float:
        if (typeof value === "string" && isNaN(parseFloat(value))) {
          return `${definition.label || definition.key} must be a valid number`;
        }
        break;

      case ValueKind.Boolean:
        if (typeof value !== "boolean") {
          return `${definition.label || definition.key} must be true or false`;
        }
        break;

      case ValueKind.Category:
        if (definition.options && definition.options.length > 0) {
          const validValues = definition.options.map((opt) => opt.value);
          if (!validValues.includes(String(value))) {
            return `${definition.label || definition.key} must be one of: ${validValues.join(", ")}`;
          }
        }
        break;
    }
  }

  return null;
};

const useCreateEntityForm = (category: EntityCategoryFragment) => {
  const defaultProperties: Record<string, PropertyValue> = {};

  category.propertyDefinitions?.forEach((def) => {
    if (def.default !== null && def.default !== undefined) {
      defaultProperties[def.key] = def.default;
    } else {
      defaultProperties[def.key] = null;
    }
  });

  const form = useForm<CreateEntityFormData>({
    defaultValues: {
      externalId: "",
      name: "",
      properties: defaultProperties,
    },
    mode: "onBlur",
  });

  const validateForm = (data: CreateEntityFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    category.propertyDefinitions?.forEach((def) => {
      const value = data.properties[def.key];
      const error = validateProperty(value, def);
      if (error) {
        errors[def.key] = error;
      }
    });

    return errors;
  };

  return { form, validateForm };
};

const serializePropertyValue = (
  value: PropertyValue,
  kind: ValueKind,
): string | number | boolean | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  switch (kind) {
    case ValueKind.Int:
      return typeof value === "string" ? parseInt(value) : Number(value);

    case ValueKind.Float:
      return typeof value === "string" ? parseFloat(value) : Number(value);

    case ValueKind.Boolean:
      return Boolean(value);

    case ValueKind.Datetime:
      if (value instanceof Date) {
        return value.toISOString();
      }
      return String(value);

    case ValueKind.String:
    case ValueKind.Category:
    default:
      return String(value);
  }
};

const PropertyField = ({
  definition,
  value,
  onChange,
  error,
}: {
  definition: PropertyDefinitionFragment;
  value: PropertyValue;
  onChange: (value: PropertyValue) => void;
  error?: string;
}) => {
  const renderInput = () => {
    // If there are predefined options, render a select
    if (definition.options && definition.options.length > 0) {
      return (
        <Select
          value={value ? String(value) : ""}
          onValueChange={(val) => onChange(val)}
        >
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={`Select ${definition.label || definition.key}`} />
          </SelectTrigger>
          <SelectContent>
            {definition.optional && (
              <SelectItem value="">
                <span className="text-muted-foreground italic">None</span>
              </SelectItem>
            )}
            {definition.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex flex-col">
                  <span>{opt.label}</span>
                  {opt.description && (
                    <span className="text-xs text-muted-foreground">
                      {opt.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    switch (definition.valueKind) {
      case ValueKind.Boolean:
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <span className="text-sm text-muted-foreground">
              {value ? "True" : "False"}
            </span>
          </div>
        );

      case ValueKind.Int:
        return (
          <Input
            type="number"
            step="1"
            value={value !== null && value !== undefined ? String(value) : ""}
            onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
            placeholder={`Enter ${definition.label || definition.key}`}
            className={error ? "border-red-500" : ""}
          />
        );

      case ValueKind.Float:
        return (
          <Input
            type="number"
            step="any"
            value={value !== null && value !== undefined ? String(value) : ""}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder={`Enter ${definition.label || definition.key}`}
            className={error ? "border-red-500" : ""}
          />
        );

      case ValueKind.Datetime:
        return (
          <DateTimePicker
            value={value instanceof Date ? value : value ? new Date(String(value)) : undefined}
            onChange={(date) => onChange(date || null)}
            className={error ? "border-red-500" : ""}
          />
        );

      case ValueKind.String:
        // Multi-line for longer descriptions
        if (definition.description && definition.description.length > 50) {
          return (
            <Textarea
              value={value ? String(value) : ""}
              onChange={(e) => onChange(e.target.value || null)}
              placeholder={`Enter ${definition.label || definition.key}`}
              className={error ? "border-red-500" : ""}
              rows={3}
            />
          );
        }
        return (
          <Input
            type="text"
            value={value ? String(value) : ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder={`Enter ${definition.label || definition.key}`}
            className={error ? "border-red-500" : ""}
          />
        );

      case ValueKind.Category:
      default:
        return (
          <Input
            type="text"
            value={value ? String(value) : ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder={`Enter ${definition.label || definition.key}`}
            className={error ? "border-red-500" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={definition.key}>
        {definition.label || definition.key}
        {!definition.optional && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {definition.description && (
        <p className="text-xs text-muted-foreground">{definition.description}</p>
      )}
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const CreateEntityWithPropertiesDialog = (props: {
  category: EntityCategoryFragment;
}) => {
  const { closeDialog } = useDialog();
  const { form, validateForm } = useCreateEntityForm(props.category);
  const [propertyErrors, setPropertyErrors] = useState<Record<string, string>>({});

  const [createEntity, { loading }] = useCreateEntityMutation({
    onCompleted: () => {
      toast.success("Entity created successfully");
      closeDialog();
    },
    onError: (error) => {
      toast.error(`Failed to create entity: ${error.message}`);
    },
    refetchQueries: ["EntityNodes", "GetEntityCategory"],
  });

  const onSubmit = async (data: CreateEntityFormData) => {
    // Validate all properties
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      setPropertyErrors(errors);
      toast.error("Please fix the validation errors");
      return;
    }

    setPropertyErrors({});

    // Serialize properties for GraphQL
    const serializedProperties: Record<string, string | number | boolean | null> = {};

    props.category.propertyDefinitions?.forEach((def) => {
      const value = data.properties[def.key];
      serializedProperties[def.key] = serializePropertyValue(value, def.valueKind);
    });

    await createEntity({
      variables: {
        input: {
          entityCategory: props.category.id,
          externalId: data.externalId || undefined,
          name: data.name || undefined,
          properties: serializedProperties,
        },
      },
    });
  };

  return (
    <div className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create New {props.category.label}</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create a new entity
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Dynamic Property Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Properties</h3>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="externalId">External ID</Label>
                <Input
                  id="externalId"
                  {...form.register("externalId")}
                  placeholder="Optional external identifier"
                />
                <p className="text-xs text-muted-foreground">
                  A unique external identifier (will upsert if exists)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Optional name for this entity"
                />
              </div>
              {props.category.propertyDefinitions.map((def) => (
                <Controller
                  key={def.key}
                  name={`properties.${def.key}`}
                  control={form.control}
                  render={({ field }) => (
                    <PropertyField
                      definition={def}
                      value={field.value}
                      onChange={field.onChange}
                      error={propertyErrors[def.key]}
                    />
                  )}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Entity"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
