const path = require('path');

module.exports = {

  test: {
    client: 'pg',
    connection: 'postgres://localhost/todos_test',
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds'),
    },
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/todos_dev',
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
