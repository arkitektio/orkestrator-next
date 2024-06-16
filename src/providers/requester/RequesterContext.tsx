import {
  AssignVariables,
  Assignation,
  Reservation,
  UnassignVariables,
} from "@jhnnsrs/rekuest-next";
import React, { useContext } from "react";

export type Resolver<T> = (value: T) => void;
export type Rejector<T> = (value: T) => void;

export class Defered<Result extends any = any, RejectReason extends any = any> {
  resolver: Resolver<Result> | undefined;
  rejecter: Rejector<RejectReason> | undefined;

  constructor();
  constructor(
    resolve: Resolver<Result> | undefined = undefined,
    reject: Rejector<RejectReason> | undefined = undefined,
  ) {
    this.resolver = resolve;
    this.rejecter = reject;
    this.reject.bind(this);
    this.resolve.bind(this);
  }

  resolve(result: Result) {
    if (this.resolver) return this.resolver(result);
    console.log("No Resolver for this function");
  }

  reject(result: RejectReason) {
    if (this.rejecter) return this.rejecter(result);
    console.log("No Resolver for this function");
  }
}

export type AssignRequest = {
  id: string;
  defered: Defered<Assignation>;
  variables: AssignRequestVariables;
};

export type AssignRequestVariables = {
  reservation: Reservation;
  defaults?: { [key: string]: any };
};

export type ResolvedAssignRequest = {
  id: string;
  defered: Defered<Assignation>;
  variables: AssignVariables;
};

export type RequesterContextType = {
  pending: AssignRequest[];
  resolve: (request: ResolvedAssignRequest) => Promise<any>;
  reject: (request: AssignRequest) => void;
  assign: (request: AssignRequestVariables) => Promise<Assignation>;
  unassign: (options: UnassignVariables) => Promise<any>;
  exists: boolean;
};

export const RequesterContext = React.createContext<RequesterContextType>({
  pending: [],
  assign: async () => {
    throw Error("Not implemented");
  },
  unassign: async () => {},
  resolve: async () => {},
  reject: async () => {},
  exists: false,
});

export const useRequester = () => useContext(RequesterContext);
