import axios from 'axios';

class AuthApi {
  constructor() {
    axios.defaults.baseURL = '/api/v1/auth';
    axios.defaults.headers = {
      'Content-Type': 'application/json',
    };
  }

  signup(user) {
    return axios.request('/signup', {
      method: 'post',
      data: user,
    });
  }

  login(user) {
    return axios.request('/login', {
      method: 'post',
      data: user,
      validateStatus: false,
    });
  }
}

export default new AuthApi();
