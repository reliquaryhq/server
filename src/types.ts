import Koa from 'koa';
import { SessionContext } from './middleware/session';

type AppState = Koa.DefaultState & AuthState;
type AppContext = SessionContext<SessionState>;

type AuthState = {
  user?: User;
};

type SessionState = {
  userId?: number;
};

type User = {
  id: number;
  passwordHash: string;
  passwordSalt: string;
  passwordKeylen: number;
};

export { AppContext, AppState, SessionState, User };
