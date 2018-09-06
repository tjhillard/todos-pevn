const axios = require('axios');
const todoSchema = require('../../../support/schemas/resource/Todo.json');
const notFoundSchema = require('../../../support/schemas/error/404.json');

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

const user = {
  email: 'foo@bar.com',
  password: 'password123',
};
let token;
let todoIdToEdit;

beforeAll(async (done) => {
  await axios.post('/auth/login', user).then((res) => {
    token = res.data.token;
    done();
  });
});

describe('PUT /todos/:id', () => {
  beforeAll(async (done) => {
    const payload = {
      method: 'post',
      url: '/todos',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        description: 'Pet my cat',
      },
    };
    await axios(payload).then((res) => {
      todoIdToEdit = res.data.data.id;
      done();
    });
  });

  describe('🔓  authenticated', () => {
    test('updates an existing todo in the database', async (done) => {
      const putPayload = {
        method: 'put',
        url: `/todos/${todoIdToEdit}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          description: 'Edited todo',
          completed: true,
        },
      };
      await axios(putPayload).then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.error).toBeUndefined();
        expect(res.data.data.description).toBe('Edited todo');
        expect(res.data.data.completed).toBe(true);
        expect(res.data.data).toMatchJsonSchema(todoSchema);
        done();
      });
    });

    test('returns a 404 if could not find the todo', async (done) => {
      const putPayload = {
        method: 'put',
        url: '/todos/12341234',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          description: 'Edited todo',
          completed: true,
        },
      };
      await axios(putPayload).catch((err) => {
        expect(err.response.status).toBe(404);
        expect(err.response.data.error).toBe(true);
        expect(err.response.data).toMatchJsonSchema(notFoundSchema);
        done();
      });
    });
  });
});
