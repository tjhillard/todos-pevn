const knex = require('./knex');

/* BASIC CRUD QUERIES */

module.exports = {
  /**
   *
   * @param {string} table
   * @description Retruns collection of resources as array of objects
   */
  getAll(table, options = {}) {
    const limit = options.per_page || 25;
    return knex(table).limit(limit);
  },

  /**
   *
   * @param {string} table
   * @param {any} options
   */
  paginate(table, options = {}) {
    const limit = options.per_page || 10;
    const pageNumber = options.pageNumber || 1;

    return knex(table)
      .orderBy('id', 'asc')
      .offset((pageNumber * limit) - limit)
      .limit(limit);
  },

  /**
   *
   * @param {string} table
   * @param {number} id
   * @description Returns single resource by given id as object
   */
  getById(table, id) {
    return knex(table).where('id', id);
  },

  /**
   *
   * @param {string} table
   * @param {any} resource
   * @description Inserts a new resource into given table with given resource object
   */
  create(table, resource) {
    return knex(table).insert(resource, '*');
  },

  /**
   *
   * @param {string} table
   * @param {number} id
   * @param {any} resource
   * @description Updates an existing resource with given resource object by given id
   */
  update(table, id, resource) {
    return knex(table).where('id', id).update(resource, '*');
  },

  /**
   *
   * @param {string} table
   * @param {number} id
   * @description Deletes an existing resource by given id
   */
  delete(table, id) {
    return knex(table).where('id', id).del('*');
  },
};
