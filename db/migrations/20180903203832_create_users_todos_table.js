exports.up = (knex, Promise) => {
  return Promise.all([
    // users
    knex.schema.createTable('user', (table) => {
      table.increments();
      table.text('email').notNullable();
      table.text('password').notNullable();
      table.boolean('deleted').defaultTo(false);
      table.timestamps(true, true);
      table.unique('email');
    }),

    knex.schema.createTable('reset_tokens', (table) => {
      table.increments();
      table.integer('user_id').references('id').inTable('user').notNullable();
      table.text('token').notNullable();
    }),

    // todos
    knex.schema.createTable('todo', (table) => {
      table.increments();
      table.integer('user_id').references('id').inTable('user').notNullable();
      table.text('description').notNullable();
      table.boolean('completed').defaultTo(false);
      table.boolean('deleted').defaultTo(false);
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('todo'),
    knex.schema.dropTable('user'),
  ]);
};
