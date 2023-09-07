
import { useReserver } from "@/providers/reserver/ReserverContext";
import { Mate, MateFinder } from "../types";

export const useReserveMate: () => MateFinder = () => {
  const { reserve } = useReserver();


  return async (options) => {
    let actions: Mate[] = [];
    if (options.justSelf) {
      actions = actions.concat([{
          action: async (event) => {
            console.log("Reserve", event.self.id)
            await reserve({
              node: event.self.id,
              defaults: {}
            });
            return "Assigned";
          },
          label: "Reserve",
        }]
      );

      return actions
    }
    

    

    return [];
  };
};
