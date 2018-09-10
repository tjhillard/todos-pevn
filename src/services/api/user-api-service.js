import axios from 'axios';

class AuthApi {
  constructor() {
    this.http = axios.create({
      baseURL: '/api/v1/users',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: false,
    });
  }

  updatePassword(password, token) {
    return this.http.request('/update_password', {
      method: 'put',
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        password,
      },
    });
  }
}

export default new AuthApi();
