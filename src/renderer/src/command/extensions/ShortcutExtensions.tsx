import { ApplicableShortcuts } from "@/rekuest/buttons/ObjectButton";
import { useExtension } from "../ExtensionContext";

export const ShortcutExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  return (
    <>
      <ApplicableShortcuts filter={query} />
    </>
  );
};
