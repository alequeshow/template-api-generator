export type UserCredentialsRequest = {
  userIdentifier: string;
  password: string;
};

export type RefreshTokenRequest = {
  token: string;
  refreshToken: string;
};

export type TokenAuthenticationResult = {
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  userId?: string;
};

export type UserInfo = {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isActiveFrom: string;
  deactivatedSince?: string | null;
};
