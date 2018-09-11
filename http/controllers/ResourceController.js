const knex = require('../knex');
const clamp = require('lodash.clamp');

module.exports = class ResourceController {
  constructor(table) {
    this.table = table;
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {any?} options - Object of options for customizing the response format
   * @returns {any[]} Array of matching resource objects
   */
  getAll(userId, options = {}) {
    const limit = clamp(options.per_page, 0, Math.max() * -1) || 25;
    return knex(this.table)
      .where('user_id', userId)
      .where('deleted', false)
      .limit(limit);
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {any?} options - Object of options for customizing the response format
   * @returns {any[]} Array of matching resource objects
   */
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

  /**
   * =
   * @param {number} userId - ID of the user associated with the resource
   * @param {number} id - ID of the resource
   * @returns {any} Object of the matching resource
   */
  getById(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .where('deleted', false)
      .first();
  }

  /**
   *
   * @param {any} resource - Object for the resource to insert
   * @returns {any} Object of the created resource
   */
  create(resource) {
    return knex(this.table).insert(resource, '*');
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {number} id - ID of the resource
   * @param {any} resource - Object for the resource to insert
   * @returns {any} Object of the updated resource
   */
  update(userId, id, resource) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .where('deleted', false)
      .update(resource, '*');
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {number} id - ID of the resource
   * @returns {any} Object of the hard deleted resource
   */
  hardDelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .del('*');
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {number} id - ID of the resource
   * @returns {any} Object of the soft deleted resource
   */
  softDelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .where('deleted', false)
      .update({ deleted: true }, '*');
  }

  /**
   *
   * @param {number} userId - ID of the user associated with the resource
   * @param {number} id - ID of the resource
   * @returns {any} Object of the undeleted resource
   */
  undelete(userId, id) {
    return knex(this.table)
      .where('user_id', userId)
      .where('id', id)
      .update({ deleted: false }, '*');
  }
};
