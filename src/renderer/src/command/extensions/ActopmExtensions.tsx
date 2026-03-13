import { useActionSearchLazyQuery } from "@/rekuest/api/graphql";
import { ApplicableActions } from "@/rekuest/buttons/ObjectButton";
import { useEffect } from "react";
import { useExtension } from "../ExtensionContext";

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
