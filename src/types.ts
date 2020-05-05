import { SessionContext } from './middleware/session';
import { AuthContext } from './middleware/auth';

type AppContext = SessionContext<SessionState> & AuthContext;

type SessionState = {
  userId?: number;
};

type User = {
  id: number;
  passwordHash: string;
  passwordSalt: string;
  passwordKeylen: number;
};

export { AppContext, SessionState, User };
