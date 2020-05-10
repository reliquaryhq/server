import Koa from 'koa';
import { Session, User } from '@reliquaryhq/types';
import { SessionContext } from './middleware/session';

type AppContext = SessionContext<Session>;

type AppState = Koa.DefaultState & AuthState;

type AuthState = {
  user?: User;
};

export { AppContext, AppState };
