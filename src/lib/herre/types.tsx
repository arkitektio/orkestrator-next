export type Scopes = string;

export interface TokenRequestBody {
  clientId: string;
  grantType: string;
  redirectUri?: string;
  refresh_token?: string;
  clientSecret?: string;
  code?: string;
  codeVerifier?: string;
}

export type HerreEndpoint = {
  base_url: string;

  tokenUrl?: string;
  authUrl?: string;

  /**
   * A userinfo endpoint that returns a openid compliant userinfo object
   * @see https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
   * This endpoint will be called with the access token in the Authorization header
   * @date 9/30/2022 - 3:41:10 PM
   *
   * @type {string}
   */
  userInfoEndpoint?: string;
};

export type HerreGrant = {
  clientId: string;
  clientSecret?: string;
  scopes: Scopes[];
  redirectUri?: string;
  finalRedirectUri?: string;
};

export type HerreUser = {
  sub?: string;
  roles?: string[];
  avatar?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
};

export type Token = string;
