<template>
  <div class="home">
    <h1>Home</h1>
    <p>{{ user }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'user',
    ]),
  },
};
</script>
