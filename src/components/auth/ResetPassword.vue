<template>
  <div class="home mt-5">
    <h1>Set a new password</h1>
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
      <form class="mt-3" @submit.prevent="attemptUpdatePassword">
        <!-- email -->
        <v-text-field
          v-model="user.password"
          label="Password"
          prepend-icon="lock"
          color="dark"
          type="password"
        ></v-text-field>
        <!-- password -->
        <v-text-field
          v-model="user.confirmPassword"
          label="Confirm Password"
          prepend-icon="lock"
          color="dark"
          type="password"
        ></v-text-field>
        <v-btn block color="primary" type="submit">Update Password</v-btn>
      </form>
    </v-flex>
  </div>
</template>

<script>
import UserApi from '@/services/api/user-api-service';

export default {
  data() {
    return {
      user: {
        password: '',
        confirmPassword: '',
      },
      errorMessage: '',
    };
  },
  methods: {
    attemptUpdatePassword() {
      if (this.user.password === this.user.confirmPassword) {
        UserApi
          .updatePassword(this.user.password, this.$route.query.token)
          .then((res) => {
            console.log(res);
            if (!res.data.error) {
              this.$router.push({ path: '/login', query: { reset: true } });
              return;
            }
            this.errorMessage = res.data.message;
            this.clearFields();
          })
          .catch((err) => {
            this.errorMessage = 'Something went wrong. Please try again.';
            this.clearFields();
          });
      } else {
        this.errorMessage = 'Password confirmation does not match.';
        this.clearFields();
      }
    },
    clearFields() {
      this.user.password = '';
      this.user.confirmPassword = '';
    },
  },
};
</script>

<style lang="scss">

</style>
