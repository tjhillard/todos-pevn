import axios from 'axios';

class AuthApi {
  constructor() {
    this.http = axios.create({
      baseURL: '/api/v1/auth',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: false,
    });
  }

  signup(user) {
    return this.http.request('/signup', {
      method: 'post',
      data: user,
    });
  }

  login(user) {
    return this.http.request('/login', {
      method: 'post',
      data: user,
    });
  }

  requestResetPasswordEmail(email) {
    return this.http.request('/forgot_password', {
      method: 'post',
      data: {
        email,
      },
    });
  }
}

export default new AuthApi();
