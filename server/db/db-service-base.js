const knex = require('./knex');

/* BASIC CRUD QUERIES */
module.exports = {
  getAll(table) {
    return knex(table);
  },

  getById(table, id) {
    return knex(table).where('id', id);
  },

  create(table, resource) {
    return knex(table).returning().insert(resource, '*');
  },

  update(table, id, resource) {
    return knex(table).where('id', id).update(resource, '*');
  },

  delete(table, id) {
    return knex(table).where('id', id).del('*');
  },
};
