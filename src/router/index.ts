import { router } from '../util';
import account from './account';
import auth from './auth';
import cdrom from './cdrom';

const root = router.createRouter();

root.use(account.routes(), account.allowedMethods());
root.use(auth.routes(), auth.allowedMethods());
root.use(cdrom.routes(), cdrom.allowedMethods());

export default root;
