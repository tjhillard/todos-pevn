<template>
  <div class="home mt-1">
    <h1>Receive an email to reset your password</h1>
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
        v-if="requestWasSuccess"
      >
        Check your inbox for steps to reset your password!
      </v-alert>
      <form class="mt-3" @submit.prevent="makeResetPasswordRequest">
        <v-text-field
          v-model="user.email"
          label="Email"
          prepend-icon="mail"
          color="dark"
          type="email"
        ></v-text-field>
        <v-btn block color="primary" type="submit">Get Email</v-btn>
      </form>
    </v-flex>
  </div>
</template>

<script>
import AuthApi from '@/services/api/auth-api-service';

export default {
  data() {
    return {
      user: {
        email: '', // Bound to email input
      },
      errorMessage: '',
      requestWasSuccess: false, // When true, display success alert
    };
  },
  methods: {
    makeResetPasswordRequest() {
      if (this.user.email) {
        AuthApi
          .requestResetPasswordEmail(this.user.email)
          .then((res) => {
            if (!res.data.error && res.status === 200) {
              this.requestWasSuccess = true;
              this.errorMessage = res.data.message;
              this.clearFields();
              return;
            }
            this.displayFallbackError();
          })
          .catch((err) => {
            this.displayFallbackError();
          });
      } else {
        this.errorMessage = 'Password confirmation does not match.';
        this.clearFields();
      }
    },
    clearFields() {
      this.user.email = '';
    },
    displayFallbackError() {
      this.errorMessage = 'Something went wrong. Please try again.';
      this.clearFields();
    },
  },
};
</script>

<style lang="scss">
</style>
