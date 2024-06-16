import {
  Reservation,
  ReserveVariables,
  UnreserveVariables,
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

export type ReserveRequest = {
  id: string;
  defered: Defered<Reservation>;
  variables: ReserveRequestVariables;
};

export type ReserveRequestVariables = {
  node: string;
  defaults?: { [key: string]: any };
};

export type ResolvedReserveRequest = {
  id: string;
  defered: Defered<Reservation>;
  variables: ReserveVariables;
};

export type ReserverContextType = {
  pending: ReserveRequest[];
  resolve: (request: ResolvedReserveRequest) => Promise<any>;
  reject: (request: ReserveRequest) => void;
  reserve: (request: ReserveRequestVariables) => Promise<Reservation>;
  unreserve: (options: UnreserveVariables) => Promise<any>;
  exists: boolean;
};

export const ReserverContext = React.createContext<ReserverContextType>({
  pending: [],
  reserve: async () => {
    throw Error("Not implemented");
  },
  unreserve: async () => {},
  resolve: async () => {},
  reject: async () => {},
  exists: false,
});

export const useReserver = () => useContext(ReserverContext);
