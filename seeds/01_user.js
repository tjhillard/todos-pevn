/* eslint-disable */
const bcrypt = require('bcrypt');

exports.seed = (knex) => {
  return knex('user').del()
    .then(() => {
      return knex('user').insert([
        { email: 'foo@bar.com', password: 'password123' },
        { email: 'foo+1@bar.com', password: 'password123' },
        { email: 'foo+2@bar.com', password: 'password123' },
        { email: 'foo+3@bar.com', password: 'password123' },
        { email: 'foo+4@bar.com', password: 'password123' },
        { email: 'foo+5@bar.com', password: 'password123' },
        { email: 'foo+6@bar.com', password: 'password123' },
      ])
  });
};
