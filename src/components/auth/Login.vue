<template>
  <div class="home mt-1">
    <h1>Log in to existing account</h1>
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
      <v-alert
        :value="true"
        type="success"
        v-if="userDidResetPassword"
      >
        Your password has been successfully reset. Please login to reauthenticate.
      </v-alert>
      <form class="mt-3" @submit.prevent="attemptLogin">
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
        <v-btn block color="primary" type="submit">Log In</v-btn>
      </form>
      <router-link tag="a" to="/forgot_password">
        Forgot your passsowrd?
      </router-link> |
      <router-link tag="a" to="/signup">
        Don't have an account yet?
      </router-link>
    </v-flex>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AuthApi from '@/services/api/auth-api-service';

export default {
  name: 'login',
  data() {
    return {
      user: {
        email: '', // Bound to email input
        password: '', // Bound to password input
      },
      errorMessage: '',
      userDidResetPassword: false, // When this is true, show the message alert informing user of state
    };
  },
  mounted() {
    if (this.$route.query.reset) {
      this.userDidResetPassword = true;
    }
  },
  methods: {
    ...mapActions([
      'setToken',
    ]),
    attemptLogin() {
      this.errorMessage = '';
      AuthApi
        .login(this.user)
        .then((res) => {
          if (!res.data.error && res.status === 200) {
            this.setToken(res.data.token);
            this.$router.push({ path: '/' });
            return;
          }
          if (res.status === 400) {
            this.errorMessage = res.data.message;
            return;
          }
          this.displayFallbackError();
        })
        .catch((err) => {
          this.displayFallbackError();
        });
    },
    displayFallbackError() {
      this.errorMessage = 'Something went wrong. Please try again.';
      this.user.password = '';
    },
  },
};
</script>

<style lang="scss"></style>
