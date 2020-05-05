import { router } from '../util';
import account from './account';
import auth from './auth';
import submission from './submission';

const root = router.createRouter();

root.use(account.routes(), account.allowedMethods());
root.use(auth.routes(), auth.allowedMethods());
root.use(submission.routes(), submission.allowedMethods());

export default root;
