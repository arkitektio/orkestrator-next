import { MutationTuple } from "@apollo/client";
import { BsTrash } from "react-icons/bs";
import { MateFinder } from "../types";

export type DeleteFunction = (x: any) => MutationTuple<any, {id: string}>


export type DeleteObjectFinder =  MateFinder;

export function buildDeleteMate(
  xfunction: DeleteFunction,
  typename: string,
): () => MateFinder {
  return () => {

    
    const [deleteItem] = xfunction({} as any);

    const realMateFinder: MateFinder = async (options) => {
      if (options.justSelf) {
        return [
          {
            action: async (event) => {
              for (const partner of event.partners) {

                deleteItem({
                  variables: { id: partner.id },
                  update(cache: any, result: any, options: any) {
                    if (typename) {
                      console.log("evicting", typename, partner.id)
                      const normalizedId = cache.identify({id: partner.id, __typename: typename});
                      cache.evict({ id: normalizedId });
                      cache.gc();
                    }
                  }
                });
              }
            },
            label: (
              <>
                <BsTrash />
              </>
            ),
            description: `Delete this ${typename}`,
          },
        ];
      }
      if (options.partnersIncludeSelf) {
        return [
          {
            action: async (event) => {
              for (const partner of event.partners) {
                deleteItem({
                  variables: { id: partner.id },
                  update(cache: any, result: any, options: any) {
                    if (typename) {
                      console.log("evicting", typename, partner.id)
                      const normalizedId = cache.identify({id: partner.id, __typename:typename});
                      cache.evict({ id: normalizedId });
                      cache.gc();
                    }
                  },
                });
              }
            },
            label: (
              <>
                <BsTrash />
              </>
            ),
            description: `Delete all ${typename}`,
          },
        ];
      }
    };

    return realMateFinder;
  };
}
