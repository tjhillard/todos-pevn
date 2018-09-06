const axios = require('axios');
const todoSchema = require('../../../support/schemas/resource/Todo.json');
const notFoundSchema = require('../../../support/schemas/error/404.json');

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

const user = {
  email: 'foo@bar.com',
  password: 'password123',
};
let token;

beforeAll(async (done) => {
  await axios.post('/auth/login', user).then((res) => {
    token = res.data.token;
    done();
  });
});

describe('GET /todos/:id', () => {
  describe('🔓  authorized', () => {
    test('returns an array of todo resources', async (done) => {
      await axios.get('/todos/1', { headers: { authorization: `Bearer ${token}` } }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.error).toBeUndefined();
        expect(res.data.data).toMatchJsonSchema(todoSchema);
        done();
      });
    });
  });

  describe('🔒  unauthorized', () => {
    test('doesnt show any todos that user isnt authorized to see', async (done) => {
      await axios.get('/todos/2', { headers: { authorization: `Bearer ${token}` } }).catch((err) => {
        expect(err.response.status).toBe(404);
        expect(err.response.data.error).toBe(true);
        expect(err.response.data).toMatchJsonSchema(notFoundSchema);
        done();
      });
    });
  });
});
