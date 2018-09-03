exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments();
      table.text('email').notNullable();
      table.text('password').notNullable();
      table.timestamps(true, true);
      table.unique('email');
    }),
  ]);
};

exports.down = (knex) => {
  return knex.schema.dropTable('user');
};
