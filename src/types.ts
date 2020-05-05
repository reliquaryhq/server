import Koa from 'koa';
import { SessionContext } from './middleware/session';

type AppContext = SessionContext<SessionState>;

type AppState = Koa.DefaultState & AuthState;

type AuthState = {
  user?: User;
};

type CdromDescription = {
  id?: number;
  cdromId?: number;
  sourceId?: number;
  submissionId?: number;
  discIndex?: number;
  labelProductName?: string;
  labelDiscName?: string;
  labelLegalese?: string;
  labelPartNumber?: string;
  labelVersion?: string;
  masteringCode?: string;
  masteringSidCode?: string;
  toolstampCode?: string;
  mouldSidCode?: string;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
};

type CdromDump = {
  id?: number;
  cdromId?: number;
  copyProtectionId?: number;
  dumpControllerId?: number;
  dumpDriveId?: number;
  dumpFormatId?: number;
  dumpModificationStateId?: number;
  dumpReadStateId?: number;
  dumpToolId?: number;
  sourceId?: number;
  submissionId?: number;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
};

type SessionState = {
  userId?: number;
};

type User = {
  id: number;
  passwordHash: string;
  passwordSalt: string;
  passwordKeylen: number;
};

export {
  AppContext,
  AppState,
  CdromDescription,
  CdromDump,
  SessionState,
  User,
};
