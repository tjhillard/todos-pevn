<template>
  <div class="home mt-5">
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
        <v-btn block color="success" type="submit">Log In</v-btn>
      </form>
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
    attemptLogin() {
      this.errorMessage = '';
      AuthApi
        .login(this.user)
        .then((response) => {
          if (!response.data.error) {
            localStorage.setItem('token', response.data.token);
            this.setToken(response.data.token);
            this.$router.push({ path: '/' });
            return;
          }
          console.log(response);
          if (response.status === 400) {
            this.errorMessage = response.data.message;
            return;
          }
          this.errorMessage = 'Something went wrong. Please try again';
          this.user.password = '';
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = 'Something went wrong. Please try again.';
          this.user.password = '';
        });
    },
  },
};
</script>

<style lang="scss">

</style>
