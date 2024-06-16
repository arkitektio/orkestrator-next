import {
  Reservation,
  UnreserveVariables,
  usePostman,
} from "@jhnnsrs/rekuest-next";
import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Defered,
  ReserveRequest,
  ReserveRequestVariables,
  ReserverContext,
  ResolvedReserveRequest,
} from "./ReserverContext";

export type ReserverProviderProps = {
  children: React.ReactNode;
};

export const ReserverProvider: React.FC<ReserverProviderProps> = ({
  children,
}) => {
  const { reserve: postreserve, unreserve: postunreserve } = usePostman();

  const [pendingRequests, setPendingRequests] = React.useState<
    ReserveRequest[]
  >([]);

  const resolve = useCallback(
    (request: ResolvedReserveRequest) => {
      let x = postreserve(request.variables);
      x.then((assign) => {
        if (assign) {
          request.defered.resolve(assign);
          setPendingRequests((pendingRequests) =>
            pendingRequests.filter((r) => r.id !== request.id),
          );
        }
      }).catch((e) => {
        console.error(e);
        request.defered.reject(e);
      });
      return x;
    },
    [setPendingRequests, postreserve],
  );

  const reject = useCallback(
    (request: ReserveRequest) => {
      setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
      request.defered.reject("User rejected request");
    },
    [setPendingRequests],
  );

  const reserve = useCallback(
    (variables: ReserveRequestVariables) => {
      var defered = new Defered();

      var promise = new Promise<Reservation>((resolve, reject) => {
        defered.resolver = resolve;
        defered.rejecter = reject;
      });

      var request: ReserveRequest = {
        id: uuidv4(),
        defered: defered,
        variables: variables,
      };

      console.log(request);

      setPendingRequests((pendingRequests) => {
        return [...pendingRequests, request];
      });

      return promise;
    },
    [setPendingRequests],
  );

  const unreserve = useCallback(
    async (variables: UnreserveVariables) => {
      await postunreserve(variables);
    },
    [postunreserve],
  );

  return (
    <ReserverContext.Provider
      value={{
        unreserve: unreserve,
        reserve: reserve,
        resolve: resolve,
        reject: reject,
        pending: pendingRequests,
        exists: true,
      }}
    >
      {children}
    </ReserverContext.Provider>
  );
};
