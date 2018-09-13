<template>
  <div class="navbar-wrapper">
    <v-layout wrap>
      <v-toolbar flat>
        <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer">
        </v-toolbar-side-icon>
        <router-link tag="v-toolbar-title" to="/" class="link">PEVN Todos</router-link>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-if="!isAuth" class="nav-link" to="/login" flat>Log In</v-btn>
          <v-btn v-if="!isAuth" class="nav-link" to="/signup" flat>Sign Up</v-btn>
          <v-btn v-if="isAuth" class="nav-link" flat @click="logout">Logout</v-btn>
        </v-toolbar-items>
      </v-toolbar>
       <v-navigation-drawer
          v-model="drawer"
          enable-resize-watcher
          light
          app
          >
          <v-list class="pa-1">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <h2>PEVN Todos</h2>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <router-link
              to="/"
              tag="v-list-tile">
              <v-list-tile-action right>
                <v-icon>cake</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Home</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
            <router-link
              to="/login"
              v-if="!isAuth"
              tag="v-list-tile">
              <v-list-tile-action right>
                <v-icon>security</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Login</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
            <router-link
              to="/signup"
              v-if="!isAuth"
              tag="v-list-tile">
              <v-list-tile-action right>
                <v-icon>tag_faces</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Sign up</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
            <v-list-tile
              v-if="isAuth"
              @click="logout">
              <v-list-tile-action right>
                <v-icon>meeting_room</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list class="pt-0" dense>
            <v-divider></v-divider>
          </v-list>
        </v-navigation-drawer>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      searchQuery: '',
      drawer: false,
      navDrawerItems: [
        { title: 'Home', icon: 'cake', href: '/' },
        { title: 'Logout', icon: 'meeting_room', href: '', onClick: 'logout', showIf: 'isAuth' },
        { title: 'Login', icon: 'security', href: 'login', showIf: '!isAuth' },
        { title: 'Sign Up', icon: 'tag_faces', href: 'signup', showIf: '!isAuth' },
      ],
    };
  },
  computed: {
    ...mapState([
      'isAuth',
    ]),
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.drawer = false;
      this.$router.push('/login');
    },
    onResize() {
      this.isMobile = window.innerWidth < 700;
    },
  },
};
</script>

<style scoped lang="scss">
.navbar-wrapper {
  border-bottom: 1px solid lightgrey;
}
.nav-link {
  text-transform: none !important;
}
.link {
  cursor: pointer;
}
</style>
