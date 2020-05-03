import { router } from '../util';
import account from './account';
import auth from './auth';

const root = router.createRouter();

root.use(account.routes(), account.allowedMethods());
root.use(auth.routes(), auth.allowedMethods());

export default root;
