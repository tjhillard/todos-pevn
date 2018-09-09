import Vue from 'vue';
import Vuex from 'vuex';
import jwtDecode from 'jwt-decode';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userToken: null,
  },
  getters: {
    user(state, getters) {
      if (state.userToken) {
        return jwtDecode(state.userToken);
      }
      return null;
    },
  },
  mutations: {
    SET_USER_TOKEN(state, token) {
      state.userToken = token;
    },
    DELETE_USER_TOKEN(state) {
      state.userToken = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    logout({ commit }) {
      commit('DELETE_USER_TOKEN');
    },
  },
});
