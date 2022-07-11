import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import { userStore } from '../store/user';

const routes = [
  { path: '/', name: 'home', redirect: '/home'},
  { path: '/home',  name: 'home', component: Home,},
  { path: '/login', name: 'login', component: Login, meta: { noAauth: true } },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { noAauth: true },
  },
  {
    path: '/userList',
    name: 'userList',
    component: import(
      /* webpackChunkName: "userList" */ '../pages/UserList.vue'
    ),
  },
  {
    path: '/uc',
    name: 'uc',
    component: import(/* webpackChunkName: "uc" */ '../pages/uc.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: import(/* webpackChunkName: "404" */ '../pages/404.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
];

let defaultRoutes = routes.filter((i) => {
  // 过滤掉需要权限认证的路由
  return i.meta ? i.meta.noAauth : false;
});

const getRoutesAuth = () => {
  // 添加路由
  let powerList = routes.filter((i) => {
    // 过滤掉不需要权限的路由 因为已经挂载过一次
    return !i.meta || !i.meta.noAauth;
  });
  powerList.forEach(e => {
    router.addRoute(e)
  })
};

console.log('defaultRoutes:', defaultRoutes);
console.log('routes:', routes);

const router = createRouter({
  history: createWebHashHistory(),
  routes: defaultRoutes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    // 判断是否登录  非`login`页面无`token`的话跳转到登录页面
    next({ path: '/login' });
  } else {
    const stores = userStore(); // pinia 状态管理
    if (to.path !== '/login' && stores.menuList.length === 0) {
      // 判断是否获取过权限
      let res = await stores.getMenuList(); // 获取权限列表
      await stores.getUserInfo(); // 获取权限列表
      if (res) {
        getRoutesAuth(); // 根据权限列表挂载路由
        next({ path: to.fullPath }); // 跳转页面
      } else {
        // 获取权限失败返回到来源页面
        next({ path: from.path });
      }
    } else {
      // 路由不存在返回原页面
      next();
    }
  }
});

export default router;
