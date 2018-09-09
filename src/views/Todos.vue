<template>
  <div class="home">
    <h1>Todos</h1>
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
