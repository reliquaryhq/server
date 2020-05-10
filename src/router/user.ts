import { User } from '@reliquaryhq/types';
import { auth, crypto, db, router } from '../util';

const user = router.createRouter({ prefix: '/user' });

user.post('/', async (ctx) => {
  const { name, password } = ctx.request.body;

  const existingUser = await db.queryOne<User>(
    db.sql`
      SELECT id
      FROM users
      WHERE name = ${name};
    `
  );

  if (!existingUser) {
    const passwordSalt = await auth.generateSalt();
    const passwordKeylen = auth.PASSWORD_KEYLEN;
    const passwordHash = await crypto.scrypt(
      password,
      passwordSalt,
      passwordKeylen
    );

    const user = await db.queryOne<User>(
      db.sql`
        INSERT INTO users (
          name,
          password_hash,
          password_salt,
          password_keylen,
          created_at,
          updated_at
        )
        VALUES (
          ${name},
          ${passwordHash.toString('base64')},
          ${passwordSalt.toString('base64')},
          ${passwordKeylen},
          NOW(),
          NOW()
        )
        RETURNING id, name, created_at, updated_at;
      `
    );

    ctx.response.status = 200;
    ctx.response.body = user;

    return;
  }

  ctx.response.status = 409;
});

user.get('/:userId', async (ctx) => {
  const user = await db.queryOne<User>(
    db.sql`
      SELECT id, name, created_at, updated_at
      FROM users
      WHERE id = ${ctx.params.userId};
    `
  );

  ctx.response.status = 200;
  ctx.response.body = user;
});

export default user;
