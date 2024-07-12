import React, { useContext } from "react";
import { HerreUser, Token, HerreEndpoint, HerreGrant } from "./types";

export type HerreContextType = {
  logout: () => void;
  login: (request: LoginRequest) => CancelableRequest<Token>;
  refresh: () => Promise<Token>;
  token?: Token;
  user?: HerreUser;
};


export type CancelableRequest<T> = {
  cancel: () => void;
  promise: Promise<T>;
}


export type LoginRequest = {
  grant: HerreGrant;
  endpoint: HerreEndpoint;
  onProgress?: (progress: string) => void;
};


export const HerreContext = React.createContext<HerreContextType>({
  logout: () => {},
  login: () => {
    return {promise: Promise.reject(Error("No FaktsProvider found")), cancel: () => {}};
  },
  refresh: () => new Promise((resolve, reject) => reject()),
});

export const useHerre = () => useContext(HerreContext);

export const useRole = (role: string): boolean => {
  const { user } = useHerre();
  return user?.roles?.includes(role) || false;
};
