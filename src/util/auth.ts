import { randomBytes } from './crypto';

const PASSWORD_DUMMY_SALT = 'xyzzyXYZZY';
const PASSWORD_KEYLEN = 64;
const PASSWORD_SALTLEN = 32;

const generateSalt = (): Promise<Buffer> => randomBytes(PASSWORD_SALTLEN);

export { PASSWORD_DUMMY_SALT, PASSWORD_KEYLEN, generateSalt };
