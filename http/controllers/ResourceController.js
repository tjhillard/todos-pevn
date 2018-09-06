const knex = require('../knex');
const clamp = require('lodash.clamp');

module.exports = class ResourceController {
  constructor(table) {
    this.table = table;
  }

  /**
   *
   * @param {string} table
   * @description Retruns collection of resources as array of objects
   */
  getAll(userId, options = {}) {
    const limit = clamp(options.per_page, 0, Math.max() * -1) || 25;
    return knex(this.table).where('user_id', userId).limit(limit);
  }

  /**
   *
   * @param {string} table
   * @param {any} options
   */
  paginate(userId, options = {}) {
    const limit = clamp(options.per_page, 0, Math.max() * -1) || 25;
    const pageNumber = clamp(options.page_number, 1, Math.max() * -1) || 1;

    return knex(this.table)
      .where('user_id', userId)
      .orderBy('id', 'asc')
      .offset((pageNumber * limit) - limit)
      .limit(limit);
  }

  /**
   *
   * @param {string} table
   * @param {number} id
   * @description Returns single resource by given id as object
   */
  getById(userId, id) {
    return knex(this.table).where('user_id', userId).where('id', id).first();
  }

  /**
   *
   * @param {string} table
   * @param {any} resource
   * @description Inserts a new resource into given table with given resource object
   */
  create(resource) {
    return knex(this.table).insert(resource, '*');
  }

  /**
   *
   * @param {string} table
   * @param {number} id
   * @param {any} resource
   * @description Updates an existing resource with given resource object by given id
   */
  update(userId, id, resource) {
    return knex(this.table).where('user_id', userId).where('id', id).update(resource, '*');
  }

  /**
   *
   * @param {string} table
   * @param {number} id
   * @description Deletes an existing resource by given id
   */
  delete(userId, id) {
    return knex(this.table).where('user_id', userId).where('id', id).del('*');
  }
};
