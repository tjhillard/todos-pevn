<template>
  <div class="home mt-2">
    <div v-if="isAuth">
      <h1>Welcome {{ user.email }}!</h1>
      <v-btn color="success" to="/todos">
        Manage Your Todos
      </v-btn>
    </div>
    <div v-else>
      <h3>
        Howdy! 🤠
        <router-link tag="a" to="/login">Login</router-link>
        or
        <router-link tag="a" to="/signup">Sign Up</router-link>
        to get started!
        👌
      </h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'user',
    ]),
    ...mapState([
      'isAuth',
    ]),
  },
};
</script>
