/* eslint-disable */
exports.seed = (knex) => {
  return knex('todo').del()
    .then(() => {
      return knex('todo').insert([
        { description: 'Pet my cat', completed: false, user_id: 1 },
        { description: 'Go to the store', completed: true, user_id: 2 },
        { description: 'Wash my jorts', completed: false, user_id: 3 },
        { description: 'Buy cat food', completed: true, user_id: 1 },
        { description: 'Eat a hotdog', completed: true, user_id: 2 },
        { description: 'Go to the gym', completed: false, user_id: 3 },
        { description: 'Read my book', completed: true, user_id: 4 },
        { description: 'Meditate', completed: false, user_id: 5 },
        { description: 'Watch some netflix', completed: false, user_id: 5 },
        { description: 'Fill bird feeder', completed: true, user_id: 4 },
      ]);
    });
};
