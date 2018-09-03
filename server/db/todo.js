const knex = require('./knex');

/* BASIC CRUD QUERIES */

module.exports = {
  /**
   *
   * @param {number} userId
   * @param {any} options
   */
  paginate(userId, options = {}) {
    const limit = options.per_page || 10;
    const pageNumber = options.pageNumber || 1;

    return knex('todo')
      .where('user_id', userId)
      .orderBy('id', 'asc')
      .offset((pageNumber * limit) - limit)
      .limit(limit);
  },

  /**
   *
   * @param {number} userId
   * @param {number} id
   * @description Returns single resource by given id as object
   */
  getById(userId, id) {
    return knex('todo').where('user_id', userId).where('id', id).first();
  },

  /**
   *
   * @param {string} table
   * @param {any} resource
   * @description Inserts a new resource into given table with given resource object
   */
  create(resource) {
    return knex('todo').insert(resource, '*');
  },

  /**
   *
   * @param {string} table
   * @param {number} id
   * @param {any} resource
   * @description Updates an existing resource with given resource object by given id
   */
  update(userId, id, resource) {
    return knex('todo').where('user_id', userId).where('id', id).update(resource, '*');
  },

  /**
   *
   * @param {string} table
   * @param {number} id
   * @description Deletes an existing resource by given id
   */
  delete(userId, id) {
    return knex('todo').where('user_id', userId).where('id', id).del('*');
  },
};
