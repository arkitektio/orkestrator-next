import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Assignation,
  UnassignVariables,
  usePostman,
} from "@jhnnsrs/rekuest-next";
import {
  AssignRequest,
  AssignRequestVariables,
  Defered,
  RequesterContext,
  ResolvedAssignRequest,
} from "./RequesterContext";

export type ReserverProviderProps = {
  children: React.ReactNode;
  autoResolve?: boolean;
};

export const RequesterProvider: React.FC<ReserverProviderProps> = ({
  children,
  autoResolve,
}) => {
  const { assign: postassign, unassign: postunassign } = usePostman();

  const [pendingRequests, setPendingRequests] = React.useState<AssignRequest[]>(
    [],
  );

  const resolve = useCallback(
    (request: ResolvedAssignRequest) => {
      let x = postassign(request.variables);
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
    [setPendingRequests, postassign],
  );

  const reject = useCallback(
    (request: AssignRequest) => {
      setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
      request.defered.reject("User rejected request");
    },
    [setPendingRequests],
  );

  const assign = useCallback(
    (variables: AssignRequestVariables) => {
      var defered = new Defered();

      var promise = new Promise<Assignation>((resolve, reject) => {
        defered.resolver = resolve;
        defered.rejecter = reject;
      });

      var request: AssignRequest = {
        id: uuidv4(),
        defered: defered,
        variables: variables,
      };

      setPendingRequests((pendingRequests) => {
        return [...pendingRequests, request];
      });

      return promise;
    },
    [setPendingRequests],
  );

  const unassign = useCallback(
    async (variables: UnassignVariables) => {
      await postunassign(variables);
    },
    [postunassign],
  );

  return (
    <RequesterContext.Provider
      value={{
        unassign: unassign,
        assign: assign,
        resolve: resolve,
        reject: reject,
        pending: pendingRequests,
        exists: true,
      }}
    >
      {children}
    </RequesterContext.Provider>
  );
};
