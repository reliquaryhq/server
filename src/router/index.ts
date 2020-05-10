import { router } from '../util';
import cdrom from './cdrom';
import session from './session';
import user from './user';

const root = router.createRouter();

root.use(cdrom.routes(), cdrom.allowedMethods());
root.use(session.routes(), session.allowedMethods());
root.use(user.routes(), user.allowedMethods());

export default root;
