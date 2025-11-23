import session from 'express-session';
import ConnectSqlite3 from 'connect-sqlite3';
import path from 'path';
import { env } from './env';

const SQLiteStore = ConnectSqlite3(session);

const sessionMiddleware = session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: path.resolve(__dirname, '../../database'),
  }) as any,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  rolling: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
    path: '/',
  },
  name: 'rankboard.sid',
});

export default sessionMiddleware;
