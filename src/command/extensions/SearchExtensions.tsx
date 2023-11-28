import { useGlobalSearchLazyQuery } from "@/mikro-next/api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { CommandGroup } from "cmdk";
import { useEffect } from "react";
import { useExtension } from "../ExtensionContext";
import { SmartCommandItem } from "../components/SmartCommandItem";

export const SearchExtensions = () => {
    const { query, activateModifier, modifiers } = useExtension();
  
    const [searchGlobal, { data }] = withMikroNext(useGlobalSearchLazyQuery)();
  
    useEffect(() => {
      if (query != undefined) {
        searchGlobal({
          variables: {
            search: query,
            noImages: false,
            noFiles: false,
            pagination: { limit: 10 },
          },
        }).catch((err) => {
          console.log(err);
        });
      }
    }, [query, modifiers]);
  
    return (
      <>
        {data && query && (
          <>
            {data?.images.length > 0 && (
              <CommandGroup heading="Images">
                {data?.images.map((image) => {
                  return (
                    <SmartCommandItem
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
  