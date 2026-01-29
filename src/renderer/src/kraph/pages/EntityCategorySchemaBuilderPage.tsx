import { useNavigate, useParams } from "react-router-dom";
import { SchemaBuilderPage } from "./SchemaBuilderPage";
import { useGetEntityCategoryQuery, useUpdateEntityCategoryMutation, useEntityNodesQuery } from "../api/graphql";
import { PropertyDefinition } from "../components/schema-builder/utils";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { detectPropertyChanges, MigrationPlan } from "../components/schema-builder/migration";
import { MigrationDialog } from "../components/schema-builder/MigrationDialog";
import { toast } from "sonner";

export function EntityCategorySchemaBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(null);
  const [pendingProperties, setPendingProperties] = useState<PropertyDefinition[] | null>(null);

  const { data, loading } = useGetEntityCategoryQuery({
    variables: { id: id! },
    skip: !id,
  });

  // Get count of existing entities for this category
  const { data: entitiesData } = useEntityNodesQuery({
    variables: {
      category: id!,
      pagination: { limit: 1 }, // We only need the count
    },
    skip: !id,
  });

  const [updateEntityCategory] = useUpdateEntityCategoryMutation({
    refetchQueries: ["GetEntityCategory"],
  });

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading schema...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!data?.entityCategory) {
    return (
      <PageLayout title="Not Found">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Entity Category not found</p>
            <p className="text-muted-foreground">
              The entity category you&apos;re looking for doesn&apos;t exist
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const entityCategory = data.entityCategory;

  const initialProperties: PropertyDefinition[] =
    entityCategory.propertyDefinitions.map((def) => ({
      key: def.key,
      label: def.label || def.key,
      description: def.description || undefined,
      valueKind: def.valueKind,
      optional: def.optional,
      default: def.default || undefined,
      required: !def.optional,
      searchable: false,
      unique: false,
    }));

  const handleSave = async (properties: PropertyDefinition[]) => {
    const originalProperties: PropertyDefinition[] =
      entityCategory.propertyDefinitions.map((def) => ({
        key: def.key,
        label: def.label || def.key,
        description: def.description || undefined,
        valueKind: def.valueKind,
        optional: def.optional,
        default: def.default || undefined,
        required: !def.optional,
        searchable: false,
        unique: false,
      }));

    // Detect changes that need migration
    const plan = detectPropertyChanges(originalProperties, properties);

    // Get entity count (approximation from pagination)
    const entityCount = 0; // TODO: Get actual count from query

    if (plan.needsMigration && entityCount > 0) {
      // Show migration dialog
      setMigrationPlan(plan);
      setPendingProperties(properties);
    } else {
      // No migration needed, save directly
      await performSave(properties);
    }
  };

  const performSave = async (properties: PropertyDefinition[], defaultValues?: Record<string, string>) => {
    await updateEntityCategory({
      variables: {
        input: {
          id: entityCategory.id,
          propertyDefinitions: properties.map((prop) => ({
            key: prop.key,
            label: prop.label,
            description: prop.description || "",
            valueKind: prop.valueKind,
            optional: prop.optional,
            default: prop.default || null,
          })),
        },
      },
    });

    if (defaultValues && migrationPlan) {
      // Here we would apply the migration to existing entities
      // For now, we'll just show a toast indicating migration would happen
      toast.info(
        `Migration plan prepared for ${entitiesData?.entityNodes?.length || 0} entities. ` +
        `Property updates will apply to new entities going forward.`
      );
    }

    navigate(-1);
  };

  const handleMigrationConfirm = async (defaultValues: Record<string, string>) => {
    if (pendingProperties) {
      await performSave(pendingProperties, defaultValues);
    }
    setMigrationPlan(null);
    setPendingProperties(null);
  };

  const handleMigrationCancel = () => {
    setMigrationPlan(null);
    setPendingProperties(null);
  };

  return (
    <>
      <SchemaBuilderPage
        title={`${entityCategory.label} Schema`}
        initialProperties={initialProperties}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
      />

      {migrationPlan && (
        <MigrationDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) handleMigrationCancel();
          }}
          plan={migrationPlan}
          entityCount={entitiesData?.entityNodes?.length || 0}
          onConfirm={handleMigrationConfirm}
          onCancel={handleMigrationCancel}
        />
      )}
    </>
  );
}
