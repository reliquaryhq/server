import { auth, crypto, db, router } from '../util';
import { User } from '../types';

const account = router.createRouter({ prefix: '/account' });

account.post('/register', async (ctx) => {
  const { name, password } = ctx.request.body;

  const user = await db.queryOne<User>(
    db.sql`SELECT id FROM users WHERE name = ${name}`
  );

  if (!user) {
    const passwordSalt = await auth.generateSalt();
    const passwordKeylen = auth.PASSWORD_KEYLEN;
    const passwordHash = await crypto.scrypt(
      password,
      passwordSalt,
      passwordKeylen
    );

    await db.queryOne<User>(
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
      `
    );

    ctx.response.status = 200;
    return;
  }

  ctx.response.status = 409;
});

export default account;
