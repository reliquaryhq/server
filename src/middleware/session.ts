import crypto from 'crypto';
import util from 'util';
import Koa from 'koa';

const DEFAULT_COOKIE_NAME = 'session';

interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | boolean;
}

interface SessionOptions {
  cookieName?: string;
  cookieOptions?: CookieOptions;
}

interface SessionContext<SessionState = {}> {
  session: Session<SessionState>;
}

const getRandomBytes = util.promisify(crypto.randomBytes);

class Session<SessionState = {}> {
  static store: Record<string, string> = {};

  /**
   * Attempts to find and load a session matching the given session ID. If no
   * session is found, creates a new session and returns it.
   *
   * Note that a newly created session will not be persisted to storage until
   * save is called.
   *
   * @param id Session ID to find in storage
   * @param ctx Koa context from the session middleware
   * @param cookieName Cookie name to use when setting the session cookie
   * @param cookieOptions Cookie options to use when setting the session cookie
   */
  static async get(
    id: string | null = null,
    ctx: Koa.Context,
    cookieName: string,
    cookieOptions?: CookieOptions
  ): Promise<Session> {
    if (id) {
      const data = this.store[id];

      if (data) {
        return new Session(id, ctx, cookieName, cookieOptions).load(data);
      }
    }

    return new Session(await this.generateId(), ctx, cookieName, cookieOptions);
  }

  /**
   * Generates a new session ID using crypto.randomBytes. The ID is encoded as
   * a base64 string before being returned.
   */
  static async generateId(): Promise<string> {
    return (await getRandomBytes(64)).toString('base64');
  }

  #id: string;
  #cookieName: string;
  #cookieOptions?: CookieOptions;
  #ctx: Koa.Context;
  #lastActiveAt = new Date();
  #state: SessionState = {} as SessionState;
  #sync = false;

  constructor(
    id: string,
    ctx: Koa.Context,
    cookieName: string,
    cookieOptions?: CookieOptions
  ) {
    this.#id = id;
    this.#ctx = ctx;
    this.#cookieName = cookieName;
    this.#cookieOptions = cookieOptions;
  }

  get lastActiveAt(): Date {
    return this.#lastActiveAt;
  }

  get state(): SessionState {
    return this.#state;
  }

  get sync(): boolean {
    return this.#sync;
  }

  load(serializedData: string): Session {
    const data = JSON.parse(serializedData);

    this.#lastActiveAt = new Date(data.lastActiveAt);
    this.#state = data.state;
    this.#sync = data.sync;

    return this;
  }

  /**
   * Persists this session to a storage provider. After the initial call to
   * save, the session will automatically save at the end of each request
   * cycle in Koa.
   */
  async save(): Promise<Session> {
    const data = {
      lastActiveAt: new Date().getUTCMilliseconds(),
      state: this.#state,
      sync: true,
    };

    const serializedData = JSON.stringify(data);

    Session.store[this.#id] = serializedData;

    this.#ctx.cookies.set(this.#cookieName, this.#id, {
      ...this.#cookieOptions,
      overwrite: true,
      signed: true,
    });

    return this;
  }

  /**
   * Removes this session from its storage provider. The session will be
   * cleared from the browser upon receit of the response.
   */
  async delete(): Promise<Session> {
    this.#sync = false;
    this.#ctx.cookies.set(this.#cookieName, '');
    delete Session.store[this.#id];

    return this;
  }
}

const middleware = (options: SessionOptions = {}): Koa.Middleware => {
  const cookieName = options.cookieName || DEFAULT_COOKIE_NAME;
  const cookieOptions = options.cookieOptions;

  const middleware: Koa.Middleware = async (ctx, next) => {
    const id = ctx.cookies.get(cookieName, { signed: true });
    const session = await Session.get(id, ctx, cookieName, cookieOptions);

    ctx.session = session;

    try {
      await next();
    } finally {
      if (session.sync) {
        session.save();
      }
    }
  };

  return middleware;
};

export { SessionContext, SessionOptions };

export default middleware;
