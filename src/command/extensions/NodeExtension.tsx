import { CommandGroup, CommandItem } from "@/components/ui/command";
import {
  ListNodeFragment,
  useNodeSearchLazyQuery,
} from "@/rekuest/api/graphql";
import { useEffect, useState } from "react";
import { useExtension } from "../ExtensionContext";

export const NodeExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  const [nodes, setNodes] = useState<ListNodeFragment[]>([]);

  const [searchNodes] = useNodeSearchLazyQuery();

  useEffect(() => {
    if (
      query == undefined ||
      query == "" ||
      modifiers.find(
        (c) => c.type === "smart" && c.identifier === "@rekuest/node",
      )
    ) {
      setNodes([]);
      return;
    } else {
      searchNodes({ variables: { filters: { search: query } } })
        .then((res) => {
          setNodes(res.data?.nodes || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query, modifiers]);

  return (
    <>
      {nodes.length > 0 && (
        <CommandGroup heading="Nodes">
          {nodes?.map((node) => {
            return (
              <CommandItem
                key={node.id}
                value={node.id}
                onSelect={() =>
                  activateModifier({
                    type: "smart",
                    identifier: "@rekuest/node",
                    id: node.id,
                    label: node.name,
                  })
                }
              >
                {node.name} ({node.id})
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
    </>
  );
};
