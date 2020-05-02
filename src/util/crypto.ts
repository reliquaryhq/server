import crypto from 'crypto';
import util from 'util';

const randomBytes: (size: number) => Promise<Buffer> = util.promisify(
  crypto.randomBytes
);

const scrypt: (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number
) => Promise<Buffer> = util.promisify(crypto.scrypt);

export { randomBytes, scrypt };
