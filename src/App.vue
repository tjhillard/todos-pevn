<template>
  <v-app id="app">
    <v-container fluid class="pa-0">
      <Navbar />
      <router-view/>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex';
import Navbar from '@/components/global/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  methods: {
    ...mapMutations([
      'SET_USER_TOKEN',
    ]),
  },
  beforeMount() {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      this.SET_USER_TOKEN(localToken);
    }
  },
};
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
