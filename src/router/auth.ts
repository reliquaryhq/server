import { crypto, db, router } from '../util';
import { User } from '../types';

const auth = router.createRouter({ prefix: '/auth' });

auth.post('/login', async (ctx) => {
  const { name, password } = ctx.request.body;

  const user = await db.queryOne<User>(
    db.sql`
      SELECT id, password_hash, password_salt, password_keylen
      FROM users
      WHERE name = ${name}
    `
  );

  if (user) {
    const passwordHash = await crypto.scrypt(
      password,
      new Buffer(user.passwordSalt, 'base64'),
      user.passwordKeylen
    );

    if (passwordHash.toString('base64') === user.passwordHash) {
      ctx.session.state.userId = user.id;
      ctx.session.save();
    }

    ctx.response.status = 200;
    return;
  }

  ctx.response.status = 401;
});

export default auth;
