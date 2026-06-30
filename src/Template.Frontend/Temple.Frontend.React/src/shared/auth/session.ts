export type SessionState = "authenticated" | "anonymous" | "refreshing";

export type SessionInfo = {
  state: SessionState;
  userId?: string;
};
