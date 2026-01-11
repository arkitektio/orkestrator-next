import { MigrationPlan } from "./migration";
import { ApolloClient, gql } from "@apollo/client";

const UPDATE_ENTITY_PROPERTIES = gql`
  mutation UpdateEntityProperties($id: ID!, $properties: [PropertyInput!]!) {
    updateEntity(input: { id: $id, properties: $properties }) {
      id
      propertyList {
        key
        value
      }
    }
  }
`;

interface EntityProperty {
  key: string;
  value: string;
}

interface Entity {
  id: string;
  propertyList: EntityProperty[];
}

/**
 * Applies migrations to a list of entities
 */
export async function applyMigrations(
  entities: Entity[],
  plan: MigrationPlan,
  defaultValues: Record<string, any>,
  client: ApolloClient<any>
): Promise<void> {
  const mutations = entities.map(async (entity) => {
    const currentProperties = new Map(
      entity.propertyList.map((p) => [p.key, p.value])
    );

    // Apply renames
    for (const rename of plan.renames) {
      const oldValue = currentProperties.get(rename.oldKey);
      if (oldValue !== undefined) {
        currentProperties.delete(rename.oldKey);
        currentProperties.set(rename.newKey, oldValue);
      }
    }

    // Remove deleted properties
    for (const removal of plan.removals) {
      currentProperties.delete(removal);
    }

    // Add new properties with default values
    for (const addition of plan.additions) {
      if (!currentProperties.has(addition.key)) {
        const defaultValue =
          defaultValues[addition.key] || addition.default || "";
        currentProperties.set(addition.key, String(defaultValue));
      }
    }

    // Convert back to array
    const updatedProperties = Array.from(currentProperties.entries()).map(
      ([key, value]) => ({
        key,
        value,
      })
    );

    // Note: The actual mutation might not support properties directly
    // This is a placeholder - we need to check if there's a way to bulk update
    // For now, this shows the intent
    return {
      entityId: entity.id,
      properties: updatedProperties,
    };
  });

  await Promise.all(mutations);
}

/**
 * Calculates migration statistics
 */
export function getMigrationStats(plan: MigrationPlan, entityCount: number) {
  return {
    totalChanges: plan.additions.length + plan.renames.length + plan.removals.length,
    affectedEntities: entityCount,
    newProperties: plan.additions.length,
    renamedProperties: plan.renames.length,
    removedProperties: plan.removals.length,
  };
}
