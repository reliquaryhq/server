import { randomBytes } from './crypto';

const PASSWORD_KEYLEN = 64;
const PASSWORD_SALTLEN = 32;

const generateSalt = (): Promise<Buffer> => randomBytes(PASSWORD_SALTLEN);

export { PASSWORD_KEYLEN, generateSalt };
