import { useCallback } from "react";
import { ListSearchField } from "./ListSearchField";

/**
 * A list field with no backing search endpoint: whatever the user types becomes
 * an option. Used for descriptor filters — structure identifiers, entity
 * category keys, ontology terms — which are free-form strings the graph does
 * not enumerate anywhere.
 */
export const FreeformListField = (props: {
  name: string;
  label: string;
  description: string;
  placeholder?: string;
}) => {
  const search = useCallback(
    async ({ search, values }: { search?: string; values?: string[] }) => {
      const options = new Map<string, { label: string; value: string }>();

      values?.forEach((value) => {
        if (value) {
          options.set(value, { label: value, value });
        }
      });

      const trimmedSearch = search?.trim();
      if (trimmedSearch) {
        options.set(trimmedSearch, {
          label: trimmedSearch,
          value: trimmedSearch,
        });
      }

      return Array.from(options.values());
    },
    [],
  );

  return (
    <ListSearchField
      name={props.name}
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      search={search}
    />
  );
};

export default FreeformListField;
