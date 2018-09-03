exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('todo', (table) => {
      table.increments();
      table.integer('user_id').references('id').inTable('user').notNullable();
      table.text('description').notNullable();
      table.boolean('completed').defaultTo(false);
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex) => {
  return knex.schema.dropTable('todo');
};
