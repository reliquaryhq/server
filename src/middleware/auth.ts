import Koa from 'koa';
import { User } from '@reliquaryhq/types';
import * as db from '../util/db';

const middleware = (): Koa.Middleware => {
  const middleware: Koa.Middleware = async (ctx, next) => {
    if (ctx.session && ctx.session.state.userId) {
      const user = await db.connection.maybeOne<User>(
        db.sql`
          SELECT *
          FROM users
          WHERE id = ${ctx.session.state.userId};
        `
      );

      if (user) {
        ctx.state.user = user;
      }
    }

    await next();
  };

  return middleware;
};

export default middleware;
