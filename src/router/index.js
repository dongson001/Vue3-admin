import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/Login', component: Login },
  { path: '/Register', component: Register },
  {
    path: '/userList',
    name: 'userList',
    component: import(
      /* webpackChunkName: "userList" */ '../pages/UserList.vue'
    ),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
