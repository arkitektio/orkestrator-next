import { useRequester } from "@/providers/requester/RequesterContext";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { Mate, MateFinder } from "../types";

export const useRequestMate: () => MateFinder = () => {
  const { assign } = useRequester();
  const { settings } = useSettings();

  const { data } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return async (options) => {
    let actions: Mate[] = [];
    if (options.justSelf) {
      let matching = data?.reservations.filter(
        (r) => r.node.args?.at(0)?.identifier == options.self.identifier,
      );

      if (matching) {
        actions = actions.concat(
          matching.map((r) => ({
            action: async (event) => {
              let key = r?.node?.args?.at(0)?.key;
              console.log(key);

              await assign({
                reservation: r,
                defaults: key ? { [key]: event.self.id } : {},
              });
              return "Assigned";
            },
            label: r?.title || r?.node.name,
          })),
        );
      }
    }

    if (options.partners && !options.partnersIncludeSelf && !options.justSelf) {
      let matching = data?.reservations.filter(
        (r) =>
          r.node.args?.at(0)?.identifier == options.self.identifier &&
          r.node.args?.at(1)?.identifier == options.partners?.at(0)?.identifier,
      ); // Matching self + partner

      if (matching) {
        actions.concat(
          matching.map((r) => ({
            action: async (event) => {
              let key = r?.node?.args?.at(0)?.key;
              let otherkey = r?.node?.args?.at(1)?.key;

              for (let partner of event.partners) {
                console.log(key);

                await assign({
                  reservation: r,
                  defaults:
                    key && otherkey
                      ? { [key]: event.self.id, [otherkey]: partner.id }
                      : {},
                });
              }
              return "Assign Batch";
            },
            label: r?.title || r?.node.name,
          })),
        );
      }
    }

    return [];
  };
};
