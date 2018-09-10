<template>
  <div>
    <ResetPassword />
  </div>
</template>

<script>
import ResetPassword from '@/components/auth/ResetPassword.vue';

export default {
  name: 'ResetPassView',
  components: {
    ResetPassword,
  },
  mounted() {
    console.log(this.$route.query.token);
  },
};
</script>
