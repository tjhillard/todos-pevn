const axios = require('axios');
const todoSchema = require('../../../support/schemas/resource/Todo.json');

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

describe('GET /todos', () => {
  describe('🔓  authenticated', () => {
    test.only('returns an array of todo resources', async (done) => {
      await axios.get('/todos', { headers: { authorization: `Bearer ${token}` } }).then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.data[0]).toMatchJsonSchema(todoSchema);
        done();
      });
    });
  });
});
