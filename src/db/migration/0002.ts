import { DatabaseMigrationType } from '../../util/db';

const up: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    ALTER TABLE users RENAME COLUMN password TO password_hash;
    ALTER TABLE users ADD COLUMN password_salt TEXT NOT NULL;
    ALTER TABLE users ADD COLUMN password_keylen SMALLINT NOT NULL;
  `);
};

const down: DatabaseMigrationType = async (connection, sql) => {
  return connection.query(sql`
    ALTER TABLE users DROP COLUMN password_keylen;
    ALTER TABLE users DROP COLUMN password_salt;
    ALTER TABLE users RENAME COLUMN password_hash TO password;
  `);
};

export { up, down };
