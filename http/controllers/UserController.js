const knex = require('../knex');

class UserController {
  getOneByEmail(email) {
    return knex('user').where('email', email).first();
  }

  create(user) {
    return knex('user').insert(user, 'id').then((ids) => {
      return ids[0];
    });
  }
}

module.exports = new UserController();
