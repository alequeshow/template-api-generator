export type SessionState = "authenticated" | "anonymous" | "refreshing";

export type SessionUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SessionInfo = {
  state: SessionState;
  user?: SessionUser;
};
