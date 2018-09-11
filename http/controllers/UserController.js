const knex = require('../knex');
const bcrypt = require('bcrypt');

class UserController {
  /**
   *
   * @param {string} email - Email address associated with a User
   * @returns {any} Object of matched user resource
   */
  getOneByEmail(email) {
    return knex('user')
      .where('email', email)
      .where('deleted', false)
      .first();
  }

  /**
   *
   * @param {number} id - ID of the existing user
   * @returns {any} Object of matched user resource
   */
  getById(id) {
    return knex('user')
      .where('id', id)
      .where('deleted', false)
      .first();
  }

  /**
   *
   * @param {any} user - User object to create
   */
  create(user) {
    return knex('user')
      .insert(user, 'id')
      .then((ids) => {
        return ids[0];
      });
  }

  /**
   *
   * @param {number} userId
   * @param {string} password
   */
  updatePassword(userId, password) {
    return knex('user')
      .where('id', userId)
      .where('deleted', false)
      .update({ password: bcrypt.hashSync(password, 10) }, '*');
  }
}

module.exports = new UserController();
