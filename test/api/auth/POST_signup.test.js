const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

describe('POST /signup', () => {
  describe('👌  valid request', () => {
    test('creates new user and returns the user id and token', async (done) => {
      const user = {
        email: `foo+${new Date().getTime()}@bar.com`,
        password: 'foobar123!',
      };
      await axios.post('/auth/signup', user).then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.id).toBeTruthy();
        expect(res.data.token).toBeTruthy();
        done();
      });
    });
  });

  describe('⚠️  invalid requests', () => {
    test('returns error when given email but no password', async (done) => {
      await axios.post('/auth/signup', {
        email: `foo+${new Date().getTime()}@bar.com`,
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns error when given password but no email', async (done) => {
      await axios.post('/auth/signup', {
        password: 'password123',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns error when given invalid email', async (done) => {
      await axios.post('/auth/signup', {
        email: 'foo@bar.',
        password: 'password123',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns error when given invalid password', async (done) => {
      await axios.post('/auth/signup', {
        email: 'foo@bar.com',
        password: '123',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns error when given non-unique email', async (done) => {
      await axios.post('/auth/signup', {
        email: 'foo@bar.com',
        password: 'foobar123!!!',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });
  });
});
