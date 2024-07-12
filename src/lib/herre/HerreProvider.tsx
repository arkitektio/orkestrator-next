import React, { useEffect, useState } from "react";
import { HerreContext, LoginRequest } from "./HerreContext";
import {
  HerreEndpoint,
  HerreGrant,
  HerreUser,
  Token,
  TokenRequestBody,
} from "./types";
import {
  createPKCECodes,
  PKCECodePair,
  toUrlEncoded,
} from "./BrowserChallenger";
export type WrappedHerreProps = {
  children?: React.ReactNode;
};

export type Code = string;

export type HerreProps = {
  children: React.ReactNode;
  grantType?: string;
  doRedirect?: (url: string, abortController: AbortController) => Promise<Code>;
  storageProvider?: StorageProvider;
  codeProvider?: () => Promise<PKCECodePair>;
};

export type LoginState = {
  grant: HerreGrant;
  endpoint: HerreEndpoint;
  auth: Auth;
  user: HerreUser;
};

export const CODE_STRING = "herre-code";
export const LOGIN_STATE = "herre-login-state";

export type Auth = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export type StorageProvider = {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
  codeProvider?: () => PKCECodePair;
};

export const localStorageProvider = {
  set: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  get: async (key: string) => {
    return localStorage.getItem(key);
  },
  remove: async (key: string) => {
    localStorage.removeItem(key);
  },
};

export const windowRedirect = (
  url: string,
  abortController: AbortController
) => {
  localStorage.setItem(CODE_STRING, "");
  window.open(url, "_blank", "noreferrer, popup");
  let count = 0;
  return new Promise<Code>((resolve, reject) => {
    const interval = setInterval(async () => {
      count += 1;
      const code = (await localStorage.getItem(CODE_STRING)) as Code;

      if (count > 100 || abortController.signal.aborted) {
        console.log("Code not changed, cancelling");
        clearInterval(interval);
        reject("Login timed out");
        return;
      }

      if (code && code.length > 0) {
        clearInterval(interval);
        console.log("Code changed, resolving", code);
        resolve(code);
      }
    }, 500);
  });
};

export const HerreProvider = ({
  children,
  grantType = "authorization_code",
  storageProvider = localStorageProvider,
  doRedirect = windowRedirect,
  codeProvider = createPKCECodes,
}: HerreProps) => {
  const [loginState, setLoginState] = useState<LoginState | undefined>();

  const persistLoginState = async (loginState: LoginState | undefined) => {
    if (!loginState) {
      await storageProvider.remove(LOGIN_STATE);
    } else {
      await storageProvider.set(LOGIN_STATE, JSON.stringify(loginState));
    }
  };

  const retrieveLoginState = async () => {
    const loginstate = await storageProvider.get(LOGIN_STATE);
    if (!loginstate) {
      return undefined;
    } else {
      try {
        return JSON.parse(loginstate) as LoginState;
      } catch (e) {
        return undefined;
      }
    }
  };

  const refreshToken = async (
    grant: HerreGrant,
    endpoint: HerreEndpoint,
    token: Auth
  ) => {
    let payload: TokenRequestBody = {
      clientId: grant.clientId.trim(),
      clientSecret: grant.clientSecret || grant.clientSecret?.trim(),
      redirectUri: grant.redirectUri,
      grantType,
    };
    console.log(payload);

    payload = {
      ...payload,
      grantType: "refresh_token",
      refresh_token: token.refresh_token,
    };

    let tokenUrl = endpoint.tokenUrl || endpoint.base_url + "/token";

    const response = await fetch(`${tokenUrl}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: toUrlEncoded(payload),
    });

    const json = await response.json();
    return json;
  };

  const fetchUserWithToken = async (endpoint: HerreEndpoint, auth: Auth) => {
    const userInfoUrl =
      endpoint.userInfoEndpoint || endpoint.base_url + "/userinfo";
    console.log(`Fetching user from ${userInfoUrl}`);
    const response = await fetch(`${userInfoUrl}`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },

      method: "GET",
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    if (data.sub) {
      return data as HerreUser;
    }

    throw new Error("No user found");
  };

  useEffect(() => {
    retrieveLoginState().then(async (persistedState) => {
      // cheking if loginstate still valid
      if (persistedState) {
        const { grant, endpoint, auth } = persistedState || {};
        try {
          let user = await fetchUserWithToken(endpoint, auth);
          setLoginState({ ...persistedState, user: user });
        } catch (e) {
          // Lets try to refresh the token
          const new_auth = await refreshToken(grant, endpoint, auth);
          setLoginState({ ...persistedState, auth: new_auth });
        }
      }
    });
  }, []);

  useEffect(() => {
    // Autopersist
    persistLoginState(loginState);
  }, [loginState]);

  const logout = async () => {
    console.log("Logging Out");
    setLoginState(undefined);
  };

  const refresh = async () => {
    if (loginState) {
      const { grant, endpoint, auth } = loginState || {};
      const new_auth = await refreshToken(grant, endpoint, auth);
      setLoginState({ ...loginState, auth: new_auth });
      return new_auth.access_token;
    }
    throw new Error("Never Login. Please Login Again!");
  };

  const challengeCode = async (
    endpoint: HerreEndpoint,
    grant: HerreGrant,
    pkce: PKCECodePair,
    code: string
  ) => {
    // We use the stored grant and endpoint here, because the

    console.log("Code changed, challenging server");
    let payload: TokenRequestBody = {
      clientId: grant.clientId.trim(),
      clientSecret: grant.clientSecret || grant.clientSecret?.trim(),
      redirectUri: grant.redirectUri,
      grantType,
      code,
      codeVerifier: pkce.codeVerifier,
    };
    console.log(payload);

    let tokenUrl = endpoint.tokenUrl || endpoint.base_url + "/token";

    const response = await fetch(`${tokenUrl}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: toUrlEncoded(payload),
    }).catch((e) => {
      throw e;
    });

    const token = await response.json();
    if (token.error) {
      throw new Error(token.error);
    }
    console.log("Token", token);
    return token as Auth;
  };

  const prepareCodeRequest = async ({
    grant,
    endpoint
  }: LoginRequest
  ) => {
    const pkce = await codeProvider();
    const codeChallenge = pkce.codeChallenge;

    const query = {
      clientId: grant.clientId.trim(),
      scopes: grant.scopes.join(" "),
      responseType: "code",
      redirectUri: grant.redirectUri,
      codeChallenge,
      codeChallengeMethod: "S256",
    };
    // Responds with a 302 redirect
    const authUri = `${
      endpoint.authUrl || endpoint.base_url || "/token"
    }?${toUrlEncoded(query)}`;
    return { authUri, pkce };
  };

  const login = (request: LoginRequest) => {

    let abortController = new AbortController();

    let result = new Promise<Token>(async (resolve, reject) => {
      try {

        let answer = await prepareCodeRequest(request)
        let {pkce, authUri} = answer

        let retrievedCode = await doRedirect(authUri, abortController)

        if (!retrievedCode) {
          throw new Error("No code retrieved")
        }

        let token = await challengeCode(request.endpoint, request.grant, pkce, retrievedCode)

        let user = await fetchUserWithToken(request.endpoint, token)

        setLoginState({
          user: user,
          auth: token,
          endpoint: request.endpoint,
          grant: request.grant,
        });

        resolve(token.access_token);
      } catch (e) {
        setLoginState(undefined);

        console.error("oauth error", e);

        reject(e);
      }
    });

    return {
      cancel: () => {
        abortController.abort();
      },
      promise: result,
    };

  };
  return (
    <HerreContext.Provider
      value={{
        logout: logout,
        login: login,
        refresh: refresh,
        user: loginState?.user,
        token: loginState?.auth?.access_token,
      }}
    >
      {children}
    </HerreContext.Provider>
  );
};
