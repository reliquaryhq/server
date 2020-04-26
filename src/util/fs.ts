import path from 'path';

const PACKAGE_DIR = path.resolve(__dirname, '../../');
const MIGRATIONS_DIR = path.resolve(PACKAGE_DIR, 'db/migrations');

export { MIGRATIONS_DIR, PACKAGE_DIR };
