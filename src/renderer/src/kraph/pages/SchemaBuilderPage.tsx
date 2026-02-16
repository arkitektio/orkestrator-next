import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { PropertyList } from "../components/schema-builder/PropertyList";
import { PropertyInspector } from "../components/schema-builder/PropertyInspector";
import { PropertyDefinition, validateSchema } from "../components/schema-builder/utils";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { ValueKind as ValueKind } from "../api/graphql";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SchemaBuilderPageProps {
  initialProperties?: PropertyDefinition[];
  title: string;
  onSave: (properties: PropertyDefinition[]) => Promise<void>;
  onCancel?: () => void;
}

interface SchemaFormData {
  properties: PropertyDefinition[];
}

export function SchemaBuilderPage({
  initialProperties = [],
  title,
  onSave,
  onCancel,
}: SchemaBuilderPageProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<SchemaFormData>({
    defaultValues: {
      properties: initialProperties,
    },
    mode: "onChange",
  });

  const { append, remove, move } = useFieldArray({
    control,
    name: "properties",
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialProperties.length > 0 ? 0 : null
  );
  const navigate = useNavigate();

  // Helper to get current properties
  const getProperties = () => getValues("properties");

  const handleAddProperty = () => {
    const properties = getProperties();
    const newProperty: PropertyDefinition = {
      key: `property_${properties.length + 1}`,
      label: `New Property ${properties.length + 1}`,
      description: "",
      valueKind: ValueKind.String,
      optional: true,
      required: false,
      searchable: false,
      unique: false,
    };
    append(newProperty);
    setSelectedIndex(properties.length);
  };

  const handleUpdateProperty = (
    index: number,
    updates: Partial<PropertyDefinition>
  ) => {
    const properties = getProperties();
    const currentProperty = properties[index];
    setValue(`properties.${index}`, { ...currentProperty, ...updates }, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDeleteProperty = (index: number) => {
    const properties = getProperties();
    remove(index);
    if (selectedIndex === index) {
      setSelectedIndex(properties.length > 1 ? 0 : null);
    } else if (selectedIndex && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleReorderProperties = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);

    // Adjust selected index if needed
    if (selectedIndex === fromIndex) {
      setSelectedIndex(toIndex);
    } else if (
      selectedIndex !== null &&
      fromIndex < selectedIndex &&
      toIndex >= selectedIndex
    ) {
      setSelectedIndex(selectedIndex - 1);
    } else if (
      selectedIndex !== null &&
      fromIndex > selectedIndex &&
      toIndex <= selectedIndex
    ) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const onSubmit = async (data: SchemaFormData) => {
    // Validate the entire schema
    const validation = validateSchema(data.properties);

    if (!validation.isValid) {
      toast.error(
        <div>
          <p className="font-semibold mb-2">Schema validation failed:</p>
          <ul className="list-disc list-inside space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    try {
      await onSave(data.properties);
      toast.success("Schema saved successfully");
    } catch (error) {
      toast.error(
        `Failed to save schema: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                Define the properties and structure of this type
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || getProperties().length === 0}
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Schema"}
          </Button>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Property List */}
        <div className="w-96">
          <PropertyList
            properties={getProperties()}
            selectedIndex={selectedIndex}
            onSelectProperty={setSelectedIndex}
            onAddProperty={handleAddProperty}
            onReorderProperties={handleReorderProperties}
          />
        </div>

        {/* Right Pane - Property Inspector */}
        <div className="flex-1 bg-accent/20">
          <PropertyInspector
            property={
              selectedIndex !== null ? getProperties()[selectedIndex] : null
            }
            onUpdate={(updates) =>
              selectedIndex !== null &&
              handleUpdateProperty(selectedIndex, updates)
            }
            onDelete={() =>
              selectedIndex !== null && handleDeleteProperty(selectedIndex)
            }
            errors={
              selectedIndex !== null && errors.properties?.[selectedIndex]
                ? errors.properties[selectedIndex]
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
