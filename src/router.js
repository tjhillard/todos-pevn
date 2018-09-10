import Vue from 'vue';
import Router from 'vue-router';
// Views
import Home from './views/Home.vue';
import Login from './views/auth/Login.vue';
import Signup from './views/auth/Signup.vue';
import ForgotPassword from './views/auth/ForgotPassword.vue';
import ResetPassword from './views/auth/ResetPassword.vue';
import Todos from './views/Todos.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/forgot_password',
      name: 'forgot_password',
      component: ForgotPassword,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/reset_password',
      name: 'reset_password',
      component: ResetPassword,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/todos',
      name: 'todos',
      component: Todos,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // ensure "/login" & "/signup" redirect to "/" when user is already authenticated
  const isAuth = localStorage.getItem('token');
  if (isAuth && to.matched.some(record => record.meta.guestOnly)) {
    next({
      path: '/',
    });
  }
  if (!isAuth && to.matched.some(record => record.meta.requiresAuth)) {
    next({
      path: '/login',
    });
  }
  next();
});

export default router;
