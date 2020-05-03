import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session, { SessionContext } from './middleware/session';
import router from './router';
import { SessionState } from './types';
import { process } from './util';

const { RELIQUARY_COOKIE_KEY } = process.env;

const app = new Koa<Koa.DefaultState, SessionContext<SessionState>>();

// Signed cookies
app.keys = [RELIQUARY_COOKIE_KEY];

// Middleware
app.use(session());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
