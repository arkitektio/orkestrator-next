import { PropertyDefinition } from "./utils";

export interface PropertyChange {
  type: "added" | "renamed" | "removed" | "modified";
  property: PropertyDefinition;
  oldKey?: string;
  newKey?: string;
}

export interface MigrationPlan {
  additions: PropertyDefinition[];
  renames: Array<{ oldKey: string; newKey: string; property: PropertyDefinition }>;
  removals: string[];
  needsMigration: boolean;
}

/**
 * Detects changes between original and new property definitions
 */
export function detectPropertyChanges(
  original: PropertyDefinition[],
  updated: PropertyDefinition[]
): MigrationPlan {
  const plan: MigrationPlan = {
    additions: [],
    renames: [],
    removals: [],
    needsMigration: false,
  };

  const originalKeys = new Set(original.map((p) => p.key));
  const updatedKeys = new Set(updated.map((p) => p.key));
  const originalByKey = new Map(original.map((p) => [p.key, p]));
  const updatedByKey = new Map(updated.map((p) => [p.key, p]));

  // Detect additions - properties in updated but not in original
  for (const property of updated) {
    if (!originalKeys.has(property.key)) {
      plan.additions.push(property);
    }
  }

  // Detect removals - properties in original but not in updated
  for (const key of originalKeys) {
    if (!updatedKeys.has(key)) {
      plan.removals.push(key);
    }
  }

  // Detect potential renames - removed properties with similar labels to added properties
  if (plan.additions.length > 0 && plan.removals.length > 0) {
    const matchedRenames = new Set<string>();

    for (const removed of plan.removals) {
      const removedProp = originalByKey.get(removed)!;

      for (const added of plan.additions) {
        // Check if labels are similar (case-insensitive match or substring)
        const removedLabel = removedProp.label.toLowerCase();
        const addedLabel = added.label.toLowerCase();

        if (
          removedLabel === addedLabel ||
          removedLabel.includes(addedLabel) ||
          addedLabel.includes(removedLabel)
        ) {
          // Likely a rename
          plan.renames.push({
            oldKey: removed,
            newKey: added.key,
            property: added,
          });
          matchedRenames.add(removed);
          matchedRenames.add(added.key);
          break;
        }
      }
    }

    // Remove matched renames from additions and removals
    plan.additions = plan.additions.filter(
      (p) => !matchedRenames.has(p.key)
    );
    plan.removals = plan.removals.filter((k) => !matchedRenames.has(k));
  }

  plan.needsMigration =
    plan.additions.length > 0 ||
    plan.renames.length > 0 ||
    plan.removals.length > 0;

  return plan;
}

/**
 * Generates migration queries for updating entities
 */
export function generateMigrationDescription(plan: MigrationPlan): string {
  const parts: string[] = [];

  if (plan.additions.length > 0) {
    parts.push(
      `Add ${plan.additions.length} new ${
        plan.additions.length === 1 ? "property" : "properties"
      }`
    );
  }

  if (plan.renames.length > 0) {
    parts.push(
      `Rename ${plan.renames.length} ${
        plan.renames.length === 1 ? "property" : "properties"
      }`
    );
  }

  if (plan.removals.length > 0) {
    parts.push(
      `Remove ${plan.removals.length} ${
        plan.removals.length === 1 ? "property" : "properties"
      }`
    );
  }

  return parts.join(", ");
}
