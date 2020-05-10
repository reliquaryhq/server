import { crypto, db, router } from '../util';
import { User } from '../types';

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
    ctx.response.body = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    return;
  }

  ctx.response.status = 401;
});

session.get('/', async (ctx) => {
  ctx.response.status = 200;
});

export default session;
