<template>
  <div class="home mt-5">
    <h1>Register a new account</h1>
    <v-flex
      xs10 offset-xs1
      sm8 offset-sm2
      md6 offset-md3
      lg4 offset-lg4>
      <v-alert
        :value="true"
        type="error"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </v-alert>
      <form class="mt-3" @submit.prevent="attemptSignup">
        <!-- email -->
        <v-text-field
          v-model="user.email"
          label="Email"
          prepend-icon="mail"
          color="dark"
          type="email"
          autofocus
        ></v-text-field>
        <!-- password -->
        <v-text-field
          v-model="user.password"
          label="Password"
          prepend-icon="lock"
          color="dark"
          type="password"
        ></v-text-field>
        <v-btn block color="primary" type="submit">Sign Up</v-btn>
      </form>
      <router-link tag="a" to="/login">
        Already have an account?
      </router-link>
    </v-flex>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AuthApi from '@/services/api/auth-api-service';

export default {
  name: 'signup',
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions([
      'setToken',
    ]),
    attemptSignup() {
      AuthApi
        .signup(this.user)
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          this.setToken(response.data.token);
          this.$router.push({ path: '/' });
        })
        .catch((err) => {
          const error = err.response ? err.response.data : {};
          if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
          this.user.password = '';
        });
    },
  },
};
</script>

<style lang="scss">

</style>
