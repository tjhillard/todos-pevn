import axios from 'axios';
import store from '../../store';

/**
 * @description Is given a axios response and checks if it is 401 unauthorized,
 * if it is, request a refresh token based off of the old one.
 */
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
