declare module 'connect-sqlite3' {
  import * as session from 'express-session';

  interface SQLiteStoreOptions {
    db?: string;
    dir?: string;
    table?: string;
    concurrentDB?: boolean;
  }

  function connectSqlite3(session: any): {
    new (options?: SQLiteStoreOptions): session.Store;
  };

  export = connectSqlite3;
}
