const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

/**
 *
 * --- WARNING! ---
 * This test is dependent on /signup working correctly
 * until I figure out how to seed users with hashed passwords
 *
 */

const user = {
  email: `foo+${new Date().getTime()}@bar.com`,
  password: 'foobar123!',
};

// Sign up with above user
beforeAll(async (done) => {
  await axios.post('/auth/signup', user).then((res) => {
    expect(res.status).toBe(200);
    done();
  });
});

// Login with same above user
describe('POST /login', () => {
  describe('👌  valid email & password', () => {
    test('returns a token', async (done) => {
      await axios.post('/auth/login', user).then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.id).toBeTruthy();
        expect(res.data.token).toBeTruthy();
        done();
      });
    });
  });

  describe('⚠️  invalid email & password', () => {
    test('returns an error with invalid creds', async (done) => {
      await axios.post('/auth/login', {
        email: 'notaregisteredemail@usagovernment.gov',
        password: 'qwerty12345',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns an error when provided email but not password', async (done) => {
      await axios.post('/auth/login', {
        email: 'notaregisteredemail@usagovernment.gov',
      }).catch((err) => {
        expect(err.response.status).toBe(400);
        expect(err.response.data.success).toBe(false);
        expect(err.response.data.id).toBeUndefined();
        expect(err.response.data.token).toBeUndefined();
        done();
      });
    });

    test('returns an error with password but not email', async (done) => {
      await axios.post('/auth/login', {
        password: 'qwerty12345',
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
