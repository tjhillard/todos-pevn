const knex = require('../knex');
const clamp = require('lodash.clamp');

module.exports = class ResourceController {
  constructor(table) {
    this.table = table;
  }

  getAll(userId, options = {}) {
    const limit = clamp(options.per_page, 0, Math.max() * -1) || 25;
    return knex(this.table)
      .where('user_id', userId)
      .where('deleted', false)
      .limit(limit);
  }

  paginate(userId, options = {}) {
    const limit = clamp(options.per_page, 0, Math.max() * -1) || 25;
    const pageNumber = clamp(options.page_number, 1, Math.max() * -1) || 1;

    return knex(this.table)
      .where('user_id', userId)
      .where('deleted', false)
      .orderBy('id', 'asc')
      .offset((pageNumber * limit) - limit)
      .limit(limit);
  }

  getById(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .where('deleted', false)
      .first();
  }

  create(resource) {
    return knex(this.table).insert(resource, '*');
  }

  update(userId, id, resource) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .where('deleted', false)
      .update(resource, '*');
  }

  hardDelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .del('*');
  }

  /**
   *
   * @param {number} userId
   * @param {number} id
   */
  softDelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .update({ deleted: true }, '*');
  }

  /**
   *
   * @param {number} userId
   * @param {number} id
   */
  unDelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .update({ deleted: false }, '*');
  }
};
