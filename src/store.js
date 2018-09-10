import Vue from 'vue';
import Vuex from 'vuex';
import jwtDecode from 'jwt-decode';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jwt: null,
    isAuth: null,
  },
  getters: {
    user(state, getters) {
      if (state.jwt) {
        const user = jwtDecode(state.jwt);
        return user;
      }
      return null;
    },
  },
  mutations: {
    SET_TOKEN_IN_STORAGE(state, token) {
      state.jwt = token;
      state.isAuth = true;
    },
    DELETE_USER_TOKEN(state) {
      state.jwt = null;
      localStorage.removeItem('token');
      state.isAuth = false;
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN_IN_STORAGE', token);
    },
    logout({ commit }) {
      commit('DELETE_USER_TOKEN');
    },
  },
});