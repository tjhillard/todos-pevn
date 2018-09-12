import axios from 'axios';
import store from '../../store';

export default response => {
  const originalRequest = response.config;
  if (response.status === 401 && response.data.message === 'jwt expired') {
    return axios
      .request('/api/v1/auth/refresh_token', {
        method: 'post',
        data: {
          token: localStorage.getItem('token'),
        },
      })
      .then((refreshResponse) => {
        return new Promise((resolve, reject) => {
          axios.request(originalRequest.url, {
            method: originalRequest.method,
            headers: {
              authorization: `Bearer ${refreshResponse.data.token}`,
            },
            params: originalRequest.params,
            data: originalRequest.data,
          })
            .then((res) => {
              store.dispatch('setToken', refreshResponse.data.token);
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .catch((err) => {
        return response;
      });
  }
  return response;
};
