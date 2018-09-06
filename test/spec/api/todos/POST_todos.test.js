const axios = require('axios');
const todoSchema = require('../../../support/schemas/resource/Todo.json');
const badRequestSchema = require('../../../support/schemas/error/400.json');

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

describe('POST /todos', () => {
  describe('🔓  authenticated', () => {
    test('saves a new todo in the database', async (done) => {
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
        expect(res.status).toBe(200);
        expect(res.data.error).toBeUndefined();
        expect(res.data.data).toMatchJsonSchema(todoSchema);
        done();
      });
    });
  });

  describe('🔒  unauthenticated', () => {
    test('retruns error if user is unauthenticated', async (done) => {
      const payload = {
        headers: {
          authorization: 'Bearer foobar',
        },
        body: {
          description: 'Pet my cat',
        },
      };
      await axios.post('/todos', payload).catch((err) => {
        expect(err.response.status).toBe(401);
        expect(err.response.data.error).toBe(true);
        done();
      });
    });
  });

  describe('⚠️  invalid request (no description)', () => {
    test('saves a new todo in the database', async (done) => {
      const payload = {
        method: 'post',
        url: '/todos',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };
      await axios(payload).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.error).toBe(true);
        expect(err.response.data).toMatchJsonSchema(badRequestSchema);
        done();
      });
    });
  });
});
