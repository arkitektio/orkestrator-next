import { ApplicableLocalActions } from "@/providers/smart/extensions/local/localactions";
import { useExtension } from "../ExtensionContext";

export const LocalActionExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  return (
    <>
      <ApplicableLocalActions
        filter={query}
        object={props.self?.object}
        identifier={props.self?.identifier}
      />
    </>
  );
};
