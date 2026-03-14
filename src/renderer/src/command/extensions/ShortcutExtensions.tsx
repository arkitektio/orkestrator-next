import { ApplicableShortcuts } from "@/providers/smart/extensions/rekuest/shortcuts";
import { useExtension } from "../ExtensionContext";

export const ShortcutExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  return (
    <>
      <ApplicableShortcuts filter={query} />
    </>
  );
};
