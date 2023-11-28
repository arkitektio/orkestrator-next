import { useSmartExtension } from "../ExtensionContext";
import { FilteredCommands } from "../components/FilteredCommands";

export const NodeActionExtension = () => {
    const { modifiers, multiple } = useSmartExtension("@rekuest/node");
  
    return (
      <>
        {modifiers.map((modifier) => (
          <FilteredCommands
            heading={modifier.label || "Node"}
            actions={[
              {
                key: "node:delete",
                label: "Reserve " + modifier.label,
                run: async () => alert("Reserve"),
              },
              {
                key: "node:edit",
                label: "Edit " + modifier.label,
                run: async () => alert("Edit"),
              },
            ]}
          />
        ))}
      </>
    );
  };