import Knex from 'knex';
import session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
const KnexSession = KnexSessionStore(session);
const knex = Knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test123',
    database: 'oconf',
  }
});

const store = new KnexSession({
  knex: knex,
  tablename: 'sessions',
});

export default store;
