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
  cdromSubmissionId?: number;
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
  cdromSubmissionId?: number;
  copyProtectionId?: number;
  dumpControllerId?: number;
  dumpDriveId?: number;
  dumpFormatId?: number;
  dumpModificationStateId?: number;
  dumpReadStateId?: number;
  dumpToolId?: number;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
};

type CdromSubmission = {
  id?: number;
  cdromId?: number;
  sourceId?: number;
  submissionStateId?: number;
  userId?: number;
  createdAt?: number;
  updatedAt?: number;
};

type SessionState = {
  userId?: number;
};

type User = {
  id: number;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  passwordKeylen: number;
};

export {
  AppContext,
  AppState,
  CdromDescription,
  CdromDump,
  CdromSubmission,
  SessionState,
  User,
};
