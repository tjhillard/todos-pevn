const knex = require('../knex');
const bcrypt = require('bcrypt');

class UserController {
  getOneByEmail(email) {
    return knex('user').where('email', email).first();
  }

  create(user) {
    return knex('user').insert(user, 'id').then((ids) => {
      return ids[0];
    });
  }

  updatePassword(userId, password) {
    console.log(userId, password);
    return knex('user')
      .where('id', userId)
      .where('deleted', false)
      .update({ password: bcrypt.hashSync(password, 10) }, '*');
  }
}

module.exports = new UserController();
