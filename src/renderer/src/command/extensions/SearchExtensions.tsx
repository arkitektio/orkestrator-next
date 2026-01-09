import { CommandGroup } from "@/components/ui/command";
import { useEffect } from "react";
import { useExtension } from "../ExtensionContext";
import { SmartCommandItem } from "../components/SmartCommandItem";
import { useGetImagesLazyQuery } from "@/mikro-next/api/graphql";

export const SearchExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  const [searchImages, { data }] = useGetImagesLazyQuery();

  useEffect(() => {
    if (query != undefined) {
      searchImages({
        variables: {
          filters: {
            search: query,
          },
          pagination: { limit: 10 },
        },
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [query, modifiers]);

  return (
    <>
      {data?.images && query && (
        <>
          {data?.images.length > 0 && (
            <CommandGroup heading="Images">
              {data?.images.map((image) => {
                return (
                  <SmartCommandItem
                    key={image.id}
                    identifier={"@mikro-next/image"}
                    id={image.id}
                    label={image.name}
                  />
                );
              })}
            </CommandGroup>
          )}
        </>
      )}
    </>
  );
};
