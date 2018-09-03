const knex = require('./knex');

/* BASIC CRUD QUERIES */

module.exports = {

  getOneByEmail(email) {
    return knex('user').where('email', email).first();
  },

  create(user) {
    return knex('user').insert(user, 'id').then((ids) => {
      return ids[0];
    });
  },

};
