type SessionState = {
  userId?: number;
};

type User = {
  id: number;
  passwordHash: string;
  passwordSalt: string;
  passwordKeylen: number;
};

export { SessionState, User };
