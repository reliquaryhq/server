import { User } from '@reliquaryhq/types';
import { auth, crypto, db, router } from '../util';

const session = router.createRouter({ prefix: '/session' });

session.post('/', async (ctx) => {
  const { name, password } = ctx.request.body;

  const user = await db.queryOne<User>(
    db.sql`
      SELECT id, password_hash, password_salt, password_keylen
      FROM users
      WHERE name = ${name}
    `
  );

  const passwordHash = await crypto.scrypt(
    password,
    new Buffer(user?.passwordSalt ?? auth.PASSWORD_DUMMY_SALT, 'base64'),
    user?.passwordKeylen ?? auth.PASSWORD_KEYLEN
  );

  if (user && passwordHash.toString('base64') === (user.passwordHash ?? '')) {
    ctx.session.state.userId = user.id;
    await ctx.session.save();

    ctx.response.status = 200;
    ctx.response.body = {
      userId: user.id,
    };

    return;
  }

  ctx.response.status = 401;
});

session.get('/', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    userId: ctx.session.state.userId,
  };
});

session.delete('/', async (ctx) => {
  if (ctx.session.state.userId) {
    await ctx.session.delete();
  }

  ctx.response.status = 200;
  ctx.response.body = {};
});

export default session;
