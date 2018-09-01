/* eslint-disable */
exports.seed = (knex) => {
  return knex('todo').del()
    .then(() => {
      return knex('todo').insert([
        { description: 'Pet my cat', completed: false },
        { description: 'Go to the store', completed: true },
        { description: 'Wash my jorts', completed: false },
        { description: 'Buy cat food', completed: true },
        { description: 'Eat a hotdog', completed: true },
        { description: 'Go to the gym', completed: false },
        { description: 'Read my book', completed: true },
        { description: 'Meditate', completed: false },
        { description: 'Watch some netflix', completed: false },
        { description: 'Fill bird feeder', completed: true },
      ]);
    });
};
