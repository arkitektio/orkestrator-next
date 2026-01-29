import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useActionSearchLazyQuery } from "@/rekuest/api/graphql";
import { useEffect } from "react";
import { useExtension } from "../ExtensionContext";
import { ApplicableActions } from "@/rekuest/buttons/ObjectButton";

export const NodeExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  const [searchNodes, { data }] = useActionSearchLazyQuery();

  useEffect(() => {
    if (query == undefined || query == "") {
      console.log("No query provided, skipping search.");
    } else {
      searchNodes({ variables: { filters: { search: query } } });
    }
  }, [query, modifiers]);

  return (
    <>
      <ApplicableActions filter={query} />
    </>
  );
};
