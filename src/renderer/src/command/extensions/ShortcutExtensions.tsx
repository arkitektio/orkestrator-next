import { useActionSearchLazyQuery } from "@/rekuest/api/graphql";
import { ApplicableShortcuts } from "@/rekuest/buttons/ObjectButton";
import { useEffect } from "react";
import { useExtension } from "../ExtensionContext";

export const ShortcutExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  return (
    <>
      <ApplicableShortcuts filter={query} />
    </>
  );
};
